package student

import (
	"fmt"
	"net/http"

	"github.com/f-wntp27/cpe-project-management/backend-go/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GET /api/student/project-student
func ListProjectStudentByStudentPID(c *gin.Context) {
	userPid, exist := c.Get("userPid")
	if !exist {
		c.JSON(http.StatusBadRequest, "invalid token or userPid not found")
		return
	}

	var student entity.Student
	if err := entity.DB().Model(&entity.Student{}).Where("student_p_id = ?", userPid).
		First(&student).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var projectStudents []entity.ProjectStudent
	if err := entity.DB().Model(&entity.ProjectStudent{}).Where("student_id = ?", student.ID).
		Preload("Project").Preload("Project.Advisor").Preload("Project.Advisor.AcademicNameTitle").
		Preload("Project.Advisor.NameTitle").
		Preload("Project.Students").Preload("Project.Students.NameTitle").
		Preload("Project.StartAcademicYearSemester").Preload("Project.FinishAcademicYearSemester").
		Preload("Project.ProjectStatus").
		Preload("ProjectMeetings").
		Preload("ProjectMeetings.AssignmentAcademicYearSemester").
		Preload("ProjectMeetings.ProjectMeetingStatus").
		Preload("Student").Preload("Student.NameTitle").
		Find(&projectStudents).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, projectStudents)
}

// /api/student/project-meetings/project-student/:projectStudentId
func ListProjectMeetingByProjectStudentID(c *gin.Context) {
	projectStudentId := c.Param("projectStudentId")

	var projectMeetings []entity.ProjectMeeting
	if err := entity.DB().Model(&entity.ProjectMeeting{}).
		Where("project_student_id = ?", projectStudentId).
		Preload("AssignmentAcademicYearSemester").Preload("ProjectMeetingStatus").
		Find(&projectMeetings).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, projectMeetings)
}

// POST api/student/project-meetings
func CreateProjectMeetings(c *gin.Context) {
	var payload []entity.ProjectMeeting
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var newProjectMeetingList []entity.ProjectMeeting
	err := entity.DB().Transaction(func(tx *gorm.DB) error {

		for _, payloadItem := range payload {
			var projectStudent entity.ProjectStudent
			if tx := entity.DB().Model(&entity.ProjectStudent{}).
				Where("id = ?", payloadItem.ProjectStudentID).
				First(&projectStudent); tx.RowsAffected == 0 {
				return fmt.Errorf("project student not found")
			}

			var academicYearSemester entity.AcademicYearSemester
			if tx := entity.DB().Model(&entity.AcademicYearSemester{}).
				Where("year = ? AND semester = ?", payloadItem.AssignmentAcademicYearSemester.Year, payloadItem.AssignmentAcademicYearSemester.Semester).
				First(&academicYearSemester); tx.RowsAffected == 0 {
				return fmt.Errorf("academic year semester not found")
			}

			var projectMeetingStatus entity.ProjectMeetingStatus
			if tx := entity.DB().Model(&entity.ProjectMeetingStatus{}).Where("status = ?", "อยู่ระหว่างการตรวจทาน").
				First(&projectMeetingStatus); tx.RowsAffected == 0 {
				return fmt.Errorf("status not found")
			}

			newProjectMeetingData := entity.ProjectMeeting{
				ProjectStudent:                 &projectStudent,
				AssignmentToDo:                 payloadItem.AssignmentToDo,
				AssignmentDone:                 payloadItem.AssignmentDone,
				AssignmentAcademicYearSemester: &academicYearSemester,
				ProjectMeetingStatus:           &projectMeetingStatus,
			}

			newProjectMeetingList = append(newProjectMeetingList, newProjectMeetingData)

		}

		if err := entity.DB().Create(&newProjectMeetingList).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, newProjectMeetingList)
}

package advisor

import (
	"fmt"
	"net/http"

	"github.com/f-wntp27/cpe-project-management/backend-go/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// POST /api/advisor/project
func CreateProject(c *gin.Context) {
	var payload entity.Project
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var studentList []*entity.Student
	for _, std := range payload.Students {
		var student entity.Student
		if tx := entity.DB().Model(&entity.Student{}).Where("student_p_id = ?", std.StudentPID).
			Find(&student); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, "student id "+std.StudentPID+" not found")
			return
		}

		student.OnGoing = true
		studentList = append(studentList, &student)
	}

	var academicYearSemester entity.AcademicYearSemester
	if tx := entity.DB().Model(&entity.AcademicYearSemester{}).
		Where("year = ? AND semester = ?", payload.StartAcademicYearSemester.Year, payload.StartAcademicYearSemester.Semester).
		Find(&academicYearSemester); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "academic year "+
			fmt.Sprintf("%d / %d", payload.StartAcademicYearSemester.Year, payload.StartAcademicYearSemester.Semester)+
			" not found")
		return
	}

	var onGoingStatus entity.ProjectStatus
	if tx := entity.DB().Model(&entity.ProjectStatus{}).Where("status = ?", "กำลังดำเนินการ").
		Find(&onGoingStatus); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "status \"กำลังดำเนินการ\"  not found")
		return
	}

	userPid, exist := c.Get("userPid")
	if !exist {
		c.JSON(http.StatusBadRequest, "incorrect token or userPid not found")
		return
	}

	var advisor entity.Advisor
	if tx := entity.DB().Model(&entity.Advisor{}).Where("advisor_p_id = ?", userPid).
		First(&advisor); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "advisor "+fmt.Sprintf("%v", userPid)+" not found")
		return
	}

	project := entity.Project{
		Name:                      payload.Name,
		StartAcademicYearSemester: &academicYearSemester,
		Students:                  studentList,
		Advisor:                   &advisor,
		ProjectStatus:             &onGoingStatus,
	}

	err := entity.DB().Transaction(func(tx *gorm.DB) error {

		if err := tx.Create(&project).Error; err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return err
		}

		if err := tx.Save(&studentList).Error; err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusCreated, project)
}

// GET /api/advisor/project/:id
func GetProject(c *gin.Context) {
	id := c.Param("id")

	var project entity.Project
	if err := entity.DB().Model(&entity.Project{}).
		Where("id = ?", id).
		Preload("ProjectStatus").
		Preload("StartAcademicYearSemester").Preload("FinishAcademicYearSemester").
		Preload("Advisor").Preload("Advisor.AcademicNameTitle").Preload("Advisor.NameTitle").
		Preload("ProjectStudents").
		Preload("ProjectStudents.ProjectMeetings").
		Preload("ProjectStudents.ProjectMeetings.AssignmentAcademicYearSemester").
		Preload("ProjectStudents.ProjectMeetings.ProjectMeetingStatus").
		Preload("ProjectStudents.ProjectDefenseRequests.").
		Preload("ProjectStudents.ProjectDefenseRequests.RequestAcademicYearSemester").
		Preload("ProjectStudents.ProjectDefenseRequests.ProjectDefenseRequestStatus").
		Preload("ProjectStudents.ProjectDefenseResults").
		Preload("ProjectStudents.ProjectDefenseResults.ResultAcademicYearSemester").
		Preload("ProjectStudents.ProjectDefenseResults.Grade").
		Preload("ProjectStudents.Student").Preload("ProjectStudents.Student.NameTitle").
		Find(&project).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, project)
}

// GET /api/advisor/projects/:academicYear/:semester
func ListProjectByAcademicYearSemester(c *gin.Context) {
	academicYear := c.Param("academicYear")
	semester := c.Param("semester")

	var academicYearSemester entity.AcademicYearSemester
	if err := entity.DB().Model(&entity.AcademicYearSemester{}).
		Where("year = ? AND semester = ?", academicYear, semester).
		Find(&academicYearSemester).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	userPid, exist := c.Get("userPid")
	if !exist {
		c.JSON(http.StatusNotFound, "invalid token or userPid not found")
		return
	}

	var advisor entity.Advisor
	if err := entity.DB().Model(&entity.Advisor{}).
		Where("advisor_p_id = ?", userPid).First(&advisor).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var projectList []entity.Project
	if err := entity.DB().Model(&entity.Project{}).
		Where("advisor_id = ? AND start_academic_year_semester_id = ?", advisor.ID, academicYearSemester.ID).
		Preload("ProjectStatus").
		Preload("StartAcademicYearSemester").Preload("FinishAcademicYearSemester").
		Preload("Students").Preload("Students.NameTitle").
		Preload("Advisor").Preload("Advisor.AcademicNameTitle").Preload("Advisor.NameTitle").
		Find(&projectList).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, projectList)
}

// GET /api/advisor/projects/ongoing
func ListProjectByOnGoingStatus(c *gin.Context) {
	userPid, exist := c.Get("userPid")
	if !exist {
		c.JSON(http.StatusNotFound, "invalid token or userPid not found")
		return
	}

	var advisor entity.Advisor
	if err := entity.DB().Model(&entity.Advisor{}).
		Where("advisor_p_id = ?", userPid).First(&advisor).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var onGoingStatus entity.ProjectStatus
	if tx := entity.DB().Model(&entity.ProjectStatus{}).Where("status = ?", "กำลังดำเนินการ").
		First(&onGoingStatus); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "status \"กำลังดำเนินการ\"  not found")
		return
	}

	var inProgressStatus entity.ProjectStatus
	if tx := entity.DB().Model(&entity.ProjectStatus{}).Where("status = ?", "การประเมินยังไม่สิ้นสุด (P)").
		First(&inProgressStatus); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "status \"การประเมินยังไม่สิ้นสุด\"  not found")
		return
	}

	var projectList []entity.Project
	if err := entity.DB().Model(&entity.Project{}).
		Where("advisor_id = ? AND (project_status_id = ? OR project_status_id = ?)", advisor.ID, onGoingStatus.ID, inProgressStatus.ID).
		Preload("ProjectStatus").
		Preload("StartAcademicYearSemester").Preload("FinishAcademicYearSemester").
		Preload("Advisor").Preload("Advisor.AcademicNameTitle").Preload("Advisor.NameTitle").
		Preload("ProjectStudents").Preload("ProjectStudents.ProjectMeetings").
		Preload("ProjectStudents.ProjectMeetings.AssignmentAcademicYearSemester").
		Preload("ProjectStudents.ProjectMeetings.ProjectMeetingStatus").
		Preload("ProjectStudents.Student").Preload("ProjectStudents.Student.NameTitle").
		Find(&projectList).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, projectList)
}

// PATCH /api/advisor/project-meeting/:id
func UpdateProjectMeeting(c *gin.Context) {
	id := c.Param("id")

	var payload entity.ProjectMeeting
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var projectMeeting entity.ProjectMeeting
	if tx := entity.DB().Model(&entity.ProjectMeeting{}).Where("id = ?", id).First(&projectMeeting); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "project meeting not found")
		return
	}

	var passStatus entity.ProjectMeetingStatus
	if tx := entity.DB().Model(&entity.ProjectMeetingStatus{}).Where("status = ?", payload.ProjectMeetingStatus.Status).First(&passStatus); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "project meeting status not found")
		return
	}

	projectMeeting.ProjectMeetingStatusID = &passStatus.ID

	if err := entity.DB().Save(&projectMeeting).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, projectMeeting)

}

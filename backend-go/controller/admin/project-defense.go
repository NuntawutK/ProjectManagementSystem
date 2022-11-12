package admin

import (
	"fmt"
	"net/http"

	"github.com/f-wntp27/cpe-project-management/backend-go/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GET /api/admin/project-defense-results/:year/:semester
func ListProjectDefenseResultByAcademicYearSemester(c *gin.Context) {
	year := c.Param("year")
	semester := c.Param("semester")

	var academicYearSemester entity.AcademicYearSemester
	if err := entity.DB().Model(&entity.AcademicYearSemester{}).
		Where("year = ? AND semester = ?", year, semester).
		Find(&academicYearSemester).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var projectDefenseResults []entity.ProjectDefenseResult
	if err := entity.DB().Model(&entity.ProjectDefenseResult{}).
		Preload("ProjectStudent").
		Preload("ProjectStudent.Project").
		Preload("ProjectStudent.Project.Advisor").
		Preload("ProjectStudent.Project.Advisor.AcademicNameTitle").
		Preload("ProjectStudent.Project.Advisor.NameTitle").
		Preload("ProjectStudent.Student.NameTitle").
		Preload("ResultAcademicYearSemester").
		Preload("Grade").
		Where("result_academic_year_semester_id = ?", academicYearSemester.ID).Find(&projectDefenseResults).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusOK, projectDefenseResults)
}

// POST /api/admin/project-defense-result
type ProjectPayload struct {
	ID                          uint `json:"id"`
	ProjectStatusID             uint `json:"projectStatusId"`
	GradingAcademicYearSemester struct {
		Year     uint `json:"year"`
		Semester uint `json:"semester"`
	} `json:"gradingAcademicYearSemester"`
}

func CreateProjectDefenseResult(c *gin.Context) {
	var projects []ProjectPayload
	if err := c.ShouldBindJSON(&projects); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var gradeS entity.Grade
	if tx := entity.DB().Model(&entity.Grade{}).Where("grade_value = ?", "S").First(&gradeS); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "grade \"S\" not found")
		return
	}

	var gradeU entity.Grade
	if tx := entity.DB().Model(&entity.Grade{}).Where("grade_value = ?", "U").First(&gradeU); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "grade \"U\" not found")
		return
	}

	var gradeP entity.Grade
	if tx := entity.DB().Model(&entity.Grade{}).Where("grade_value = ?", "P").First(&gradeP); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "grade \"P\" not found")
		return
	}

	var completeProjectStatus entity.ProjectStatus
	if tx := entity.DB().Model(&entity.ProjectStatus{}).Where("status = ?", "ผ่าน (S)").First(&completeProjectStatus); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "status \"ผ่าน\" not found")
		return
	}

	var failedProjectStatus entity.ProjectStatus
	if tx := entity.DB().Model(&entity.ProjectStatus{}).Where("status = ?", "ไม่ผ่าน (U)").First(&failedProjectStatus); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "status \"ไม่ผ่าน\" not found")
		return
	}

	var ongoingProjectStatus entity.ProjectStatus
	if tx := entity.DB().Model(&entity.ProjectStatus{}).Where("status = ?", "กำลังดำเนินการ").First(&ongoingProjectStatus); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "status \"กำลังดำเนินการ\" not found")
		return
	}

	var inProgressProjectStatus entity.ProjectStatus
	if tx := entity.DB().Model(&entity.ProjectStatus{}).Where("status = ?", "การประเมินยังไม่สิ้นสุด (P)").First(&inProgressProjectStatus); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "status \"การประเมินยังไม่สิ้นสุด\" not found")
		return
	}

	var newProjects []entity.Project

	txErr := entity.DB().Transaction(func(tx *gorm.DB) error {
		for _, item := range projects {
			var project entity.Project
			if tx := entity.DB().Model(&entity.Project{}).Preload("ProjectStudents").
				Preload("ProjectStudents.ProjectDefenseResults").
				Preload("Students").
				Where("id = ?", item.ID).Find(&project); tx.RowsAffected == 0 {
				return fmt.Errorf("project id %d not found", item.ID)
			}

			var gradingAcademicYearSemester entity.AcademicYearSemester
			if tx := entity.DB().Model(&entity.AcademicYearSemester{}).
				Where("year = ? AND semester = ?", item.GradingAcademicYearSemester.Year, item.GradingAcademicYearSemester.Semester).
				First(&gradingAcademicYearSemester); tx.RowsAffected == 0 {
				return fmt.Errorf("academic year %d semester %d not found", item.GradingAcademicYearSemester.Year, item.GradingAcademicYearSemester.Semester)
			}

			var newProjectStudents []*entity.ProjectStudent
			var newStudents []*entity.Student

			switch item.ProjectStatusID {
			case completeProjectStatus.ID:
				project.GradingAcademicYearSemester = &gradingAcademicYearSemester
				project.FinishAcademicYearSemester = &gradingAcademicYearSemester
				project.ProjectStatus = &completeProjectStatus

				// Student grading
				for _, ps := range project.ProjectStudents {
					newProjectResults := entity.ProjectDefenseResult{
						Grade:                      &gradeS,
						ProjectStudent:             ps,
						ResultAcademicYearSemester: &gradingAcademicYearSemester,
					}
					ps.ProjectDefenseResults = []*entity.ProjectDefenseResult{&newProjectResults}

					newProjectStudents = append(newProjectStudents, ps)
				}

				// Update student status
				for _, std := range project.Students {
					newStudent := std
					newStudent.OnGoing = false
					newStudent.Completed = true
					newStudents = append(newStudents, newStudent)
				}

			case failedProjectStatus.ID:
				project.GradingAcademicYearSemester = &gradingAcademicYearSemester
				project.FinishAcademicYearSemester = &gradingAcademicYearSemester
				project.ProjectStatus = &failedProjectStatus

				// Student grading
				for _, ps := range project.ProjectStudents {
					newProjectResults := entity.ProjectDefenseResult{
						Grade:                      &gradeU,
						ProjectStudent:             ps,
						ResultAcademicYearSemester: &gradingAcademicYearSemester,
					}
					ps.ProjectDefenseResults = []*entity.ProjectDefenseResult{&newProjectResults}

					newProjectStudents = append(newProjectStudents, ps)
				}

				// Update student status
				for _, std := range project.Students {
					newStudent := std
					newStudent.OnGoing = false
					newStudent.Completed = false
					newStudents = append(newStudents, newStudent)
				}

			case inProgressProjectStatus.ID:
				/* Project is not completed, do not set finish academic year semester */
				// project.FinishAcademicYearSemester = gradingAcademicYearSemester
				project.GradingAcademicYearSemester = &gradingAcademicYearSemester
				project.ProjectStatus = &inProgressProjectStatus

				// Student grading
				for _, ps := range project.ProjectStudents {
					newProjectResults := entity.ProjectDefenseResult{
						Grade:                      &gradeP,
						ProjectStudent:             ps,
						ResultAcademicYearSemester: &gradingAcademicYearSemester,
					}
					ps.ProjectDefenseResults = []*entity.ProjectDefenseResult{&newProjectResults}

					newProjectStudents = append(newProjectStudents, ps)
				}

				// Update student status
				// In this case, student who got grade P is not be changed
				for _, std := range project.Students {
					newStudent := std
					newStudent.OnGoing = true
					newStudent.Completed = false
					newStudents = append(newStudents, newStudent)
				}

			case ongoingProjectStatus.ID:
				/* Project is not completed, do not set finish academic year semester */
				// project.FinishAcademicYearSemester = &gradingAcademicYearSemester
				project.GradingAcademicYearSemester = &gradingAcademicYearSemester
				/* automatically grade P */
				project.ProjectStatus = &inProgressProjectStatus

				// Student grading
				for _, ps := range project.ProjectStudents {
					newProjectResults := entity.ProjectDefenseResult{
						Grade:                      &gradeP,
						ProjectStudent:             ps,
						ResultAcademicYearSemester: &gradingAcademicYearSemester,
					}
					ps.ProjectDefenseResults = []*entity.ProjectDefenseResult{&newProjectResults}

					newProjectStudents = append(newProjectStudents, ps)
				}

				// Update student status
				// In this case, student who got grade P is not be changed
				for _, std := range project.Students {
					newStudent := std
					newStudent.OnGoing = true
					newStudent.Completed = false
					newStudents = append(newStudents, newStudent)
				}
			}

			if err := tx.Save(&newStudents).Error; err != nil {
				return err
			}

			project.ProjectStudents = newProjectStudents
			newProjects = append(newProjects, project)
		}

		if err := tx.Save(&newProjects).Error; err != nil {
			return err
		}

		return nil
	})

	if txErr != nil {
		c.JSON(http.StatusBadRequest, txErr.Error())
		return
	}

	var projectsResponse []entity.Project
	for _, item := range projects {
		var project entity.Project
		entity.DB().Model(&entity.Project{}).Where("id = ?", item.ID).
			Preload("StartAcademicYearSemester").
			Preload("GradingAcademicYearSemester").
			Preload("FinishAcademicYearSemester").
			Preload("ProjectStatus").
			Preload("ProjectStudents").
			Preload("ProjectStudents.ProjectDefenseResults").
			Preload("Students").
			First(&project)
		projectsResponse = append(projectsResponse, project)
	}

	c.JSON(http.StatusOK, projectsResponse)
}

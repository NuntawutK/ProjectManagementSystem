package admin

import (
	"net/http"

	"github.com/f-wntp27/cpe-project-management/backend-go/entity"
	"github.com/gin-gonic/gin"
)

// GET /api/admin/project-statuses
func ListProjectStatus(c *gin.Context) {
	var projectStatuses []entity.ProjectStatus

	if err := entity.DB().Model(&entity.ProjectStatus{}).Order("id ASC").
		Find(&projectStatuses).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, projectStatuses)
}

// GET /api/admin/projects/grade
func ListProjectForGrading(c *gin.Context) {
	var onGoingStatus entity.ProjectStatus
	if tx := entity.DB().Model(&entity.ProjectStatus{}).Where("status = ?", "กำลังดำเนินการ").
		Find(&onGoingStatus); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "status \"กำลังดำเนินการ\"  not found")
		return
	}

	var inProgressStatus entity.ProjectStatus
	if tx := entity.DB().Model(&entity.ProjectStatus{}).Where("status = ?", "การประเมินยังไม่สิ้นสุด (P)").
		Find(&inProgressStatus); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "status \"การประเมินยังไม่สิ้นสุด\"  not found")
		return
	}

	var project []entity.Project
	if err := entity.DB().Model(&entity.Project{}).
		Preload("Advisor").
		Preload("Advisor.AcademicNameTitle").
		Preload("Advisor.NameTitle").
		Preload("StartAcademicYearSemester").
		Preload("GradingAcademicYearSemester").
		Preload("FinishAcademicYearSemester").
		Preload("ProjectStatus").
		Preload("ProjectStudents").
		Preload("ProjectStudents.Student").Preload("ProjectStudents.Student.NameTitle").
		Preload("ProjectStudents.ProjectDefenseResults").
		Where("project_status_id = ?", onGoingStatus.ID).Or("project_status_id = ?", inProgressStatus.ID).
		Find(&project).Order("advisor_id ASC").Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, project)
}

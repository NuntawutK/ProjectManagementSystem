package advisor

import (
	"net/http"

	"github.com/f-wntp27/cpe-project-management/backend-go/entity"
	"github.com/gin-gonic/gin"
)

// GET /api/advisor/project-defense-requests
func ListProjectDefenseRequest(c *gin.Context) {

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

	var projectDefenseRequests []entity.ProjectDefenseRequest
	if err := entity.DB().Model(&entity.ProjectDefenseRequest{}).
		Joins("JOIN project_students ON project_students.id = project_defense_requests.project_student_id").
		Joins("JOIN projects ON projects.id = project_students.project_id AND advisor_id = ?", advisor.ID).
		Preload("ProjectStudent").
		Preload("ProjectStudent.Project").
		Preload("ProjectStudent.Project.Advisor").
		Preload("ProjectStudent.Project.Advisor.AcademicNameTitle").
		Preload("ProjectStudent.Project.Advisor.NameTitle").
		Preload("ProjectStudent.Project.StartAcademicYearSemester").
		Preload("ProjectStudent.Project.FinishAcademicYearSemester").
		Preload("ProjectStudent.Project.ProjectStatus").
		Preload("ProjectStudent.Student").
		Preload("ProjectStudent.Student.NameTitle").
		Preload("ProjectStudent.ProjectMeetings").
		Preload("ProjectStudent.ProjectMeetings.AssignmentAcademicYearSemester").
		Preload("ProjectStudent.ProjectMeetings.ProjectMeetingStatus").
		Preload("RequestAcademicYearSemester").
		Preload("ProjectDefenseRequestStatus").
		Find(&projectDefenseRequests).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, projectDefenseRequests)
}

// PATCH /api/advisor/project-defense-request/:id
func UpdateProjectDefenseRequest(c *gin.Context) {
	id := c.Param("id")

	var payload entity.ProjectDefenseRequest
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var requestStatus entity.ProjectDefenseRequestStatus
	if payload.ProjectDefenseRequestStatusAccepted {
		if tx := entity.DB().Model(&entity.ProjectDefenseRequestStatus{}).
			Where("status = ?", "อนุมัติ").First(&requestStatus); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, "request status \"อนุมัติ\" not found")
			return
		}
	} else {
		if tx := entity.DB().Model(&entity.ProjectDefenseRequestStatus{}).
			Where("status = ?", "ไม่อนุมัติ").First(&requestStatus); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, "request status \"ไม่อนุมัติ\" not found")
			return
		}
	}

	var currentRequest entity.ProjectDefenseRequest
	if tx := entity.DB().Model(&entity.ProjectDefenseRequest{}).
		Where("id = ?", id).First(&currentRequest); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "project defense request not found")
		return
	}

	currentRequest.ProjectDefenseRequestStatusAccepted = payload.ProjectDefenseRequestStatusAccepted
	currentRequest.ProjectDefenseRequestStatus = &requestStatus
	currentRequest.ProjectDefenseRequestStatusMessage = payload.ProjectDefenseRequestStatusMessage

	if err := entity.DB().Save(&currentRequest).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, currentRequest)
}

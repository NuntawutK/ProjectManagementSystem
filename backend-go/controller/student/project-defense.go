package student

import (
	"net/http"

	"github.com/f-wntp27/cpe-project-management/backend-go/entity"
	"github.com/gin-gonic/gin"
)

// GET /api/student/project-defense-requests
func ListProjectDefenseRequest(c *gin.Context) {
	userPid, exist := c.Get("userPid")
	if !exist {
		c.JSON(http.StatusNotFound, "invalid token or userPid not found")
		return
	}

	var student entity.Student
	if err := entity.DB().Model(&entity.Student{}).
		Where("student_p_id = ?", userPid).First(&student).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var projectDefenseRequests []entity.ProjectDefenseRequest
	if err := entity.DB().Model(&entity.ProjectDefenseRequest{}).
		Joins("JOIN project_students ON project_students.id = project_defense_requests.project_student_id AND project_students.student_id = ?", student.ID).
		Preload("ProjectStudent").
		Preload("ProjectStudent.Project").
		Preload("ProjectStudent.Project.Advisor").
		Preload("ProjectStudent.Project.Advisor.AcademicNameTitle").
		Preload("ProjectStudent.Project.Advisor.NameTitle").
		Preload("ProjectStudent.Project.StartAcademicYearSemester").
		Preload("ProjectStudent.Project.ProjectStatus").
		Preload("ProjectStudent.Student").
		Preload("ProjectStudent.Student.NameTitle").
		Preload("ProjectStudent.ProjectMeetings").
		Preload("ProjectStudent.ProjectMeetings.AssignmentAcademicYearSemester").
		Preload("ProjectStudent.ProjectMeetings.ProjectMeetingStatus").
		Preload("ProjectDefenseRequestStatus").
		Preload("RequestAcademicYearSemester").
		Find(&projectDefenseRequests).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, projectDefenseRequests)
}

// POST /api/student/project-defense-request
func CreateProjectDefenseRequest(c *gin.Context) {
	var payload entity.ProjectDefenseRequest

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var projectStudent entity.ProjectStudent
	if tx := entity.DB().Model(&entity.ProjectStudent{}).
		Where("id = ?", payload.ProjectStudentID).Find(&projectStudent); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "project student not found")
		return
	}

	var requestAcademicYearSemester entity.AcademicYearSemester
	if tx := entity.DB().Model(&entity.AcademicYearSemester{}).
		Where("year = ? AND semester = ?", payload.RequestAcademicYearSemester.Year, payload.RequestAcademicYearSemester.Semester).
		First(&requestAcademicYearSemester); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "academic year semester not found")
		return
	}

	var onGoingRequestStatus entity.ProjectDefenseRequestStatus
	if tx := entity.DB().Model(&entity.ProjectDefenseRequestStatus{}).
		Where("status = ?", "อยู่ระหว่างการอนุมัติ").
		First(&onGoingRequestStatus); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "request status \"อยู่ระหว่างการอนุมัติ\" not found")
		return
	}

	var approvedRequestStatus entity.ProjectDefenseRequestStatus
	if tx := entity.DB().Model(&entity.ProjectDefenseRequestStatus{}).
		Where("status = ?", "อนุมัติ").
		First(&approvedRequestStatus); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "request status \"อนุมัติ\" not found")
		return
	}

	var findDuplicateWaitingRequest entity.ProjectDefenseRequest
	if tx := entity.DB().Model(&entity.ProjectDefenseRequest{}).
		Where("project_student_id = ? AND project_defense_request_status_id = ?", projectStudent.ID, onGoingRequestStatus.ID).
		Find(&findDuplicateWaitingRequest); tx.RowsAffected > 0 {
		c.JSON(http.StatusBadRequest, "YOUR_REQUEST_IS_DUPLICATE")
		return
	}

	var findDuplicateApprovedRequest entity.ProjectDefenseRequest
	if tx := entity.DB().Model(&entity.ProjectDefenseRequest{}).
		Where("project_student_id = ? AND project_defense_request_status_id = ?", projectStudent.ID, approvedRequestStatus.ID).
		Find(&findDuplicateApprovedRequest); tx.RowsAffected > 0 {
		c.JSON(http.StatusBadRequest, "YOUR_REQUEST_IS_APPROVED")
		return
	}

	newProjectDefenseRequest := entity.ProjectDefenseRequest{
		ProjectStudent:                      &projectStudent,
		RequestAcademicYearSemester:         &requestAcademicYearSemester,
		PartOfSubject:                       payload.PartOfSubject,
		PartOfSubjectName:                   payload.PartOfSubjectName,
		ProjectDefenseRequestStatus:         &onGoingRequestStatus,
		ProjectDefenseRequestStatusMessage:  "",
		ProjectDefenseRequestStatusAccepted: true,
	}

	if err := entity.DB().Create(&newProjectDefenseRequest).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, newProjectDefenseRequest)

}

// GET /api/student/project-defense-requests/:id/file-name
func ListProjectDefenseFileName(c *gin.Context) {
	projectDefenseRequestId := c.Param("id")

	var projectDefenseFileStorages []entity.ProjectDefenseFileStorage
	if err := entity.DB().Model(&entity.ProjectDefenseFileStorage{}).
		Select("id, file_name").
		Where("project_defense_request_id = ?", projectDefenseRequestId).
		Find(&projectDefenseFileStorages).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, projectDefenseFileStorages)
}

// PATCH /api/student/project-defense-request/upload
func UpdateProjectDefenseRequest(c *gin.Context) {
	var payload entity.ProjectDefenseRequest
	var projectDefenseRequest entity.ProjectDefenseRequest

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	if tx := entity.DB().Model(&entity.ProjectDefenseRequest{}).Where("id = ?", payload.ID).First(&projectDefenseRequest); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "project request not found")
		return
	}

	projectDefenseRequest.ProjectDefenseFileStorages = payload.ProjectDefenseFileStorages

	if err := entity.DB().Save(&projectDefenseRequest).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, projectDefenseRequest.ID)
}

// GET /api/student/project-defense-file-storage/:id
func OpenSubmittedFiles(c *gin.Context) {
	id := c.Param("id")

	var file entity.ProjectDefenseFileStorage
	if tx := entity.DB().Model(&entity.ProjectDefenseFileStorage{}).Where("id = ?", id).First(&file); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "project file not found")
		return
	}

	c.JSON(http.StatusOK, file)
}

// DELETE /api/student/project-defense-file-storage/:id
func DeleteSubmittedFiles(c *gin.Context) {
	id := c.Param("id")

	if tx := entity.DB().Delete(&entity.ProjectDefenseFileStorage{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "project file not found")
		return
	}

	c.JSON(http.StatusOK, id)
}

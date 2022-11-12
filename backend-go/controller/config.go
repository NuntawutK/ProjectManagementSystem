package controller

import (
	"net/http"

	"github.com/f-wntp27/cpe-project-management/backend-go/entity"

	"github.com/gin-gonic/gin"
)

// GET /api/config/get
func GetConfig(c *gin.Context) {
	var config entity.Config

	if err := entity.DB().Model(&entity.Config{}).Preload("CurrentAcademicYearSemester").Last(&config).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, config)
}

// POST /api/config/create
func CreateConfig(c *gin.Context) {
	var payload entity.Config

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var academicYearSemester entity.AcademicYearSemester
	if err := entity.DB().Model(&entity.AcademicYearSemester{}).
		Where("year = ? AND semester = ?", payload.CurrentAcademicYearSemester.Year, payload.CurrentAcademicYearSemester.Semester).
		Find(&academicYearSemester).Error; err != nil {
		c.JSON(http.StatusBadRequest, "academic year semester not found")
		return
	}

	newConfig := entity.Config{
		CurrentAcademicYearSemester: &academicYearSemester,
		MaxProjectMeetingItem:       payload.MaxProjectMeetingItem,
	}

	if err := entity.DB().Create(&newConfig).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, newConfig)
}

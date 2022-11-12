package admin

import (
	"net/http"

	"github.com/f-wntp27/cpe-project-management/backend-go/entity"
	"github.com/gin-gonic/gin"
)

// GET /api/admin/advisors
func ListAdvisor(c *gin.Context) {
	var advisors []entity.Advisor
	if err := entity.DB().Model(&entity.Advisor{}).
		Preload("AcademicNameTitle").Preload("NameTitle").Find(&advisors).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusOK, advisors)
}

// POST /api/admin/advisor
func CreateAdvisor(c *gin.Context) {
	var payload entity.Advisor
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var academicNameTitle entity.AcademicNameTitle
	if tx := entity.DB().Model(&entity.AcademicNameTitle{}).Where("id = ?", payload.AcademicNameTitleID).
		First(&academicNameTitle); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, "academic name title not found")
		return
	}

	var nameTitle entity.NameTitle
	if tx := entity.DB().Model(&entity.NameTitle{}).Where("id = ?", payload.NameTitleID).
		First(&nameTitle); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, "name title not found")
		return
	}

	var advisorRole entity.UserLoginRole
	if tx := entity.DB().Model(&entity.UserLoginRole{}).Where("role = ?", "Advisor").
		First(&advisorRole); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, "role advisor not found")
		return
	}

	// Use Advisor PID as password for first time
	hashPassword, err := entity.HashPassword(payload.AdvisorPID)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	newAdvisorLogin := entity.UserLogin{
		UserPID:       payload.AdvisorPID,
		Password:      hashPassword,
		UserLoginRole: &advisorRole,
	}

	newAdvisor := entity.Advisor{
		AcademicNameTitle: &academicNameTitle,
		NameTitle:         &nameTitle,
		FirstName:         payload.FirstName,
		LastName:          payload.LastName,
		AdvisorPID:        payload.AdvisorPID,
		Email:             payload.Email,
		UserLogin:         &newAdvisorLogin,
	}

	if err := entity.DB().Create(&newAdvisor).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusCreated, newAdvisor)
}

// POST /api/admin/advisors
func CreateAdvisorList(c *gin.Context) {
	var payload []entity.Advisor

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	if len(payload) == 0 {
		c.JSON(http.StatusBadRequest, "advisor list is empty")
		return
	}

	var advisorRole entity.UserLoginRole
	if tx := entity.DB().Model(&entity.UserLoginRole{}).Where("role = ?", "Advisor").
		First(&advisorRole); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, "role advisor not found")
		return
	}

	var newAdvisorList []entity.Advisor

	for _, pload := range payload {
		var academicNameTitle entity.AcademicNameTitle
		if tx := entity.DB().Model(&entity.AcademicNameTitle{}).Where("id = ?", pload.AcademicNameTitle.ID).
			First(&academicNameTitle); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, "academic name title not found")
			return
		}

		var nameTitle entity.NameTitle
		if tx := entity.DB().Model(&entity.NameTitle{}).Where("id = ?", pload.NameTitle.ID).
			First(&nameTitle); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, "name title not found")
			return
		}

		// Use Advisor PID as password for first time
		hashPassword, err := entity.HashPassword(pload.AdvisorPID)
		if err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
		newAdvisorLogin := entity.UserLogin{
			UserPID:       pload.AdvisorPID,
			Password:      hashPassword,
			UserLoginRole: &advisorRole,
		}

		newAdvisorList = append(newAdvisorList, entity.Advisor{
			AcademicNameTitle: &academicNameTitle,
			NameTitle:         &nameTitle,
			FirstName:         pload.FirstName,
			LastName:          pload.LastName,
			AdvisorPID:        pload.AdvisorPID,
			Email:             pload.Email,
			UserLogin:         &newAdvisorLogin,
		})
	}

	if err := entity.DB().Create(&newAdvisorList).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusCreated, newAdvisorList)
}

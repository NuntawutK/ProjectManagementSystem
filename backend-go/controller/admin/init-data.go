package admin

import (
	"net/http"

	"github.com/f-wntp27/cpe-project-management/backend-go/entity"
	"github.com/gin-gonic/gin"
)

// GET /api/admin/academic-name-titles
func ListAcademicNameTitle(c *gin.Context) {
	var academicNameTitles []entity.AcademicNameTitle
	if err := entity.DB().Model(&entity.AcademicNameTitle{}).Order("id ASC").
		Find(&academicNameTitles).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusOK, academicNameTitles)
}

// GET /api/admin/academic-years
func ListAcademicYear(c *gin.Context) {
	var academicYears []entity.AcademicYear
	if err := entity.DB().Model(&entity.AcademicYear{}).Order("year ASC").
		Find(&academicYears).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusOK, academicYears)
}

// GET /api/admin/name-titles
func ListNameTitle(c *gin.Context) {
	var nameTitles []entity.NameTitle
	if err := entity.DB().Model(&entity.NameTitle{}).Order("id ASC").
		Find(&nameTitles).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusOK, nameTitles)
}

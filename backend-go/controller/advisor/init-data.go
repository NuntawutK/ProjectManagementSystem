package advisor

import (
	"net/http"

	"github.com/f-wntp27/cpe-project-management/backend-go/entity"
	"github.com/gin-gonic/gin"
)

// GET /api/advisor/academic-years
func ListAcademicYear(c *gin.Context) {
	var academicYears []entity.AcademicYear
	if err := entity.DB().Model(&entity.AcademicYear{}).Order("year ASC").
		Find(&academicYears).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusOK, academicYears)
}

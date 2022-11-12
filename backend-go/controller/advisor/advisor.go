package advisor

import (
	"net/http"

	"github.com/f-wntp27/cpe-project-management/backend-go/entity"
	"github.com/gin-gonic/gin"
)

// GET /api/advisor
func GetAdvisor(c *gin.Context) {
	userPid, exist := c.Get("userPid")
	if !exist {
		c.JSON(http.StatusNotFound, "invalid token or userPid not found")
		return
	}

	var advisor entity.Advisor
	if err := entity.DB().Model(&entity.Advisor{}).
		Preload("AcademicNameTitle").Preload("NameTitle").
		Where("advisor_p_id = ?", userPid).First(&advisor).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, advisor)
}

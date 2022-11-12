package student

import (
	"net/http"

	"github.com/f-wntp27/cpe-project-management/backend-go/entity"
	"github.com/gin-gonic/gin"
)

// GET /api/student
func GetStudent(c *gin.Context) {
	userPid, exist := c.Get("userPid")
	if !exist {
		c.JSON(http.StatusNotFound, "invalid token or userPid not found")
		return
	}

	var student entity.Student
	if err := entity.DB().Model(&entity.Student{}).
		Preload("NameTitle").
		Where("student_p_id = ?", userPid).First(&student).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, student)
}

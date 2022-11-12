package advisor

import (
	"net/http"

	"github.com/f-wntp27/cpe-project-management/backend-go/entity"
	"github.com/gin-gonic/gin"
)

// GET /api/advisor/students
func ListStudent(c *gin.Context) {
	getMode := c.Query("getMode")
	userPid, exist := c.Get("userPid")
	if !exist {
		c.JSON(http.StatusBadRequest, "cannot get advisor id")
		return
	}

	var advisor entity.Advisor
	if err := entity.DB().Model(&entity.Advisor{}).
		Where("advisor_p_id = ?", userPid).Find(&advisor).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var studentList []entity.Student
	if getMode == "CREATING_NEW_PROJECT" {
		if err := entity.DB().Model(&entity.Student{}).
			Where("advisor_id = ? AND completed = ? AND on_going = ?", advisor.ID, false, false).
			Preload("NameTitle").
			Find(&studentList).Error; err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
	} else if getMode == "GET_ALL_STUDENT" {
		if err := entity.DB().Model(&entity.Student{}).
			Where("advisor_id = ?", advisor.ID).
			Preload("NameTitle").
			Find(&studentList).Error; err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
	}

	c.JSON(http.StatusOK, studentList)
}

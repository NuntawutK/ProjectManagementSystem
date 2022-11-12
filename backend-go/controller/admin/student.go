package admin

import (
	"net/http"

	"github.com/f-wntp27/cpe-project-management/backend-go/entity"
	"github.com/gin-gonic/gin"
)

// GET /api/admin/student
func ListStudent(c *gin.Context) {
	var studentList []entity.Student
	if err := entity.DB().Model(&entity.Student{}).
		Preload("NameTitle").Preload("Advisor").Preload("Advisor.AcademicNameTitle").
		Preload("Advisor.NameTitle").Find(&studentList).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusOK, studentList)
}

// GET /api/admin/student/grade
func ListStudentForGrading(c *gin.Context) {
	var studentList []entity.Student
	if err := entity.DB().Model(&entity.Student{}).
		Preload("NameTitle").Preload("Advisor").Preload("Advisor.AcademicNameTitle").
		Preload("Advisor.NameTitle").
		Preload("ProjectDatas").
		Preload("ProjectDatas.StartAcademicYearSemester").
		Preload("ProjectDatas.ProjectDataStatus").
		Where("on_going = ? AND completed = ?", true, false).
		Find(&studentList).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, studentList)
}

// POST /api/admin/student
func CreateStudent(c *gin.Context) {
	var payload entity.Student
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var nameTitle entity.NameTitle
	if err := entity.DB().Model(&entity.NameTitle{}).Where("id = ?", payload.NameTitleID).
		First(&nameTitle).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var advisor entity.Advisor
	if err := entity.DB().Model(&entity.Advisor{}).Where("id = ?", payload.AdvisorID).
		First(&advisor).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var studentRole entity.UserLoginRole
	if err := entity.DB().Model(&entity.UserLoginRole{}).Where("role = ?", "Student").
		First(&studentRole).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	// Use Student PID as password for first time
	hashPassword, err := entity.HashPassword(payload.StudentPID)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	newStudentLogin := entity.UserLogin{
		UserPID:       payload.StudentPID,
		Password:      hashPassword,
		UserLoginRole: &studentRole,
	}

	newStudent := entity.Student{
		NameTitle:  &nameTitle,
		FirstName:  payload.FirstName,
		LastName:   payload.LastName,
		StudentPID: payload.StudentPID,
		Advisor:    &advisor,
		UserLogin:  &newStudentLogin,
		OnGoing:    false,
		Completed:  false,
	}

	if err := entity.DB().Create(&newStudent).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusCreated, newStudent)
}

// POST /api/admin/students
func CreateStudentList(c *gin.Context) {
	var payload []entity.Student
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var studentRole entity.UserLoginRole
	if err := entity.DB().Model(&entity.UserLoginRole{}).Where("role = ?", "Student").
		First(&studentRole).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var newStudentList []entity.Student
	for _, pload := range payload {
		var nameTitle entity.NameTitle
		if err := entity.DB().Model(&entity.NameTitle{}).Where("id = ?", pload.NameTitle.ID).
			First(&nameTitle).Error; err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}

		var advisor entity.Advisor
		if err := entity.DB().Model(&entity.Advisor{}).Where("advisor_p_id = ?", pload.Advisor.AdvisorPID).
			First(&advisor).Error; err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}

		// Use Student PID as password for first time
		hashPassword, err := entity.HashPassword(pload.StudentPID)
		if err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
		newStudentLogin := entity.UserLogin{
			UserPID:       pload.StudentPID,
			Password:      hashPassword,
			UserLoginRole: &studentRole,
		}

		newStudentList = append(newStudentList, entity.Student{
			NameTitle:  &nameTitle,
			FirstName:  pload.FirstName,
			LastName:   pload.LastName,
			StudentPID: pload.StudentPID,
			Advisor:    &advisor,
			UserLogin:  &newStudentLogin,
			OnGoing:    false,
			Completed:  false,
		})
	}

	if err := entity.DB().Create(&newStudentList).Error; err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusCreated, newStudentList)
}

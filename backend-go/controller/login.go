package controller

import (
	"net/http"

	"github.com/f-wntp27/cpe-project-management/backend-go/entity"
	"github.com/f-wntp27/cpe-project-management/backend-go/service"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type LoginPayload struct {
	UserPID  string `json:"userPid"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
	Role  string `json:"role"`
}

// POST /api/login/user
func Login(c *gin.Context) {
	var payload LoginPayload

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	jwtWrapper := service.JwtWrapper{
		SecretKey:       "cpe_project_management_system",
		Issuer:          "AuthService",
		ExpirationHours: 1,
	}

	var userLogin entity.UserLogin
	if tx := entity.DB().Raw("SELECT * FROM user_logins WHERE user_p_id = ?", payload.UserPID).
		Preload("UserLoginRole").Find(&userLogin); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "user not found")
		return
	}

	if userLogin.UserLoginRole.Role == "Student" {
		var student entity.Student
		if tx := entity.DB().Raw("SELECT * FROM students WHERE student_p_id = ?", payload.UserPID).
			Preload("UserLogin").Find(&student); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, "student not found")
			return
		}

		err := bcrypt.CompareHashAndPassword([]byte(student.UserLogin.Password), []byte(payload.Password))
		if err != nil {
			c.JSON(http.StatusBadRequest, "invalid user credentials")
			return
		}

		signedToken, err := jwtWrapper.GenerateToken(student.StudentPID)

		if err != nil {
			c.JSON(http.StatusInternalServerError, "error signing token")
			return
		}

		response := LoginResponse{
			Token: signedToken,
			Role:  "ROLE_STUDENT",
		}

		c.JSON(http.StatusOK, response)

	} else if userLogin.UserLoginRole.Role == "Advisor" {
		var advisor entity.Advisor
		if tx := entity.DB().Raw("SELECT * FROM advisors WHERE advisor_p_id = ?", payload.UserPID).
			Preload("UserLogin").Find(&advisor); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, "advisor not found")
			return
		}

		err := bcrypt.CompareHashAndPassword([]byte(advisor.UserLogin.Password), []byte(payload.Password))
		if err != nil {
			c.JSON(http.StatusBadRequest, "invalid user credentials")
			return
		}

		signedToken, err := jwtWrapper.GenerateToken(advisor.AdvisorPID)

		if err != nil {
			c.JSON(http.StatusInternalServerError, "error signing token")
			return
		}

		response := LoginResponse{
			Token: signedToken,
			Role:  "ROLE_ADVISOR",
		}

		c.JSON(http.StatusOK, response)

	}

}

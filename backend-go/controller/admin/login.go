package admin

import (
	"net/http"

	"github.com/f-wntp27/cpe-project-management/backend-go/entity"
	"github.com/f-wntp27/cpe-project-management/backend-go/service"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type LoginPayload struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	ID    uint   `json:"id"`
	Token string `json:"token"`
	Role  string `json:"role"`
}

// POST /api/login/admin
func Login(c *gin.Context) {
	var payload LoginPayload

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var admin entity.Admin
	if tx := entity.DB().Raw("SELECT * FROM admins WHERE username = ?", payload.Username).Find(&admin); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, "admin not found")
		return
	}

	err := bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(payload.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, "invalid user credentials")
		return
	}

	jwtWrapper := service.JwtWrapper{
		SecretKey:       "cpe_project_management_system",
		Issuer:          "AuthService",
		ExpirationHours: 1,
	}

	signedToken, err := jwtWrapper.GenerateToken(admin.Username)

	if err != nil {
		c.JSON(http.StatusInternalServerError, "error signing token")
		return
	}

	response := LoginResponse{
		ID:    admin.ID,
		Token: signedToken,
		Role:  "ROLE_ADMIN",
	}

	c.JSON(http.StatusOK, response)

}

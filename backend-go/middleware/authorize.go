package middleware

import (
	"net/http"
	"strings"

	"github.com/f-wntp27/cpe-project-management/backend-go/service"

	"github.com/gin-gonic/gin"
)

// validates token
func Authorizes() gin.HandlerFunc {
	return func(c *gin.Context) {
		clientToken := c.Request.Header.Get("Authorization")
		if clientToken == "" {
			c.AbortWithStatusJSON(http.StatusForbidden, "no authorization header provided")
			return
		}

		extractedToken := strings.Split(clientToken, "Bearer ")

		if len(extractedToken) == 2 {
			clientToken = strings.TrimSpace(extractedToken[1])
		} else {
			c.AbortWithStatusJSON(http.StatusBadRequest, "incorrect format of authorization token")
			return
		}

		jwtWrapper := service.JwtWrapper{
			SecretKey: "cpe_project_management_system",
			Issuer:    "AuthService",
		}

		claims, err := jwtWrapper.ValidateToken(clientToken)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, err.Error())
			return
		}

		c.Set("userPid", claims.UserPID)

		c.Next()
	}
}

package middleware

import (
	"finance-tracker/internal/model"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			model.RespondUnauthorized(c, "authorization header is required")
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			model.RespondUnauthorized(c, "invalid authorization header format")
			c.Abort()
			return
		}

		tokenString := parts[1]

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			model.RespondUnauthorized(c, "invalid or expired token")
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			model.RespondUnauthorized(c, "invalid token claims")
			c.Abort()
			return
		}

		userID := uint(claims["user_id"].(float64))
		email := claims["email"].(string)
		role := claims["role"].(string)

		c.Set("user_id", userID)
		c.Set("email", email)
		c.Set("role", role)

		c.Next()
	}
}

func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists || role != "admin" {
			model.RespondForbidden(c, "admin access required")
			c.Abort()
			return
		}

		c.Next()
	}
}

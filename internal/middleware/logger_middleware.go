package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func LoggerMiddleware(logger *zap.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		query := c.Request.URL.RawQuery
		method := c.Request.Method
		clientIP := c.ClientIP()
		userAgent := c.Request.UserAgent()

		c.Next()

		duration := time.Since(start)
		statusCode := c.Writer.Status()

		fields := []zap.Field{
			zap.Int("status", statusCode),
			zap.String("method", method),
			zap.String("path", path),
			zap.String("query", query),
			zap.String("ip", clientIP),
			zap.String("user_agent", userAgent),
			zap.Duration("duration", duration),
			zap.Int("body_size", c.Writer.Size()),
		}

		userID, exists := c.Get("user_id")
		if exists {
			fields = append(fields, zap.Any("user_id", userID))
		}

		if len(c.Errors) > 0 {
			for _, e := range c.Errors {
				fields = append(fields, zap.String("error", e.Error()))
			}
			logger.Error("request completed with error", fields...)
			return
		}

		if statusCode >= 500 {
			logger.Error("server error", fields...)
		} else if statusCode >= 400 {
			logger.Warn("client error", fields...)
		} else {
			logger.Info("request completed", fields...)
		}
	}
}

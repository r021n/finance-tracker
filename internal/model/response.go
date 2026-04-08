package model

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Meta    *Meta       `json:"meta,omitempty"`
}

type Meta struct {
	CurrentPage int   `json:"current_page"`
	PerPage     int   `json:"per_page"`
	TotalItems  int64 `json:"total_items"`
	TotalPages  int   `json:"total_pages"`
}

func SuccessResponse(message string, data interface{}) Response {
	return Response{
		Status:  "success",
		Message: message,
		Data:    data,
	}
}

func SuccessResponseWithMeta(message string, data interface{}, meta *Meta) Response {
	return Response{
		Status:  "success",
		Message: message,
		Data:    data,
		Meta:    meta,
	}
}

func ErrorResponse(message string) Response {
	return Response{
		Status:  "error",
		Message: message,
	}
}

func RespondSuccess(c *gin.Context, statusCode int, message string, data interface{}) {
	c.JSON(statusCode, SuccessResponse(message, data))
}

func RespondSuccessWithMeta(c *gin.Context, statusCode int, message string, data interface{}, meta *Meta) {
	c.JSON(statusCode, SuccessResponseWithMeta(message, data, meta))
}

func RespondError(c *gin.Context, statusCode int, message string) {
	c.JSON(statusCode, ErrorResponse(message))
}

func RespondBadRequest(c *gin.Context, message string) {
	RespondError(c, http.StatusBadRequest, message)
}

func RespondUnauthorized(c *gin.Context, message string) {
	RespondError(c, http.StatusUnauthorized, message)
}

func RespondForbidden(c *gin.Context, message string) {
	RespondError(c, http.StatusForbidden, message)
}

func RespondNotFound(c *gin.Context, message string) {
	RespondError(c, http.StatusNotFound, message)
}

func RespondInternalError(c *gin.Context, message string) {
	RespondError(c, http.StatusInternalServerError, message)
}

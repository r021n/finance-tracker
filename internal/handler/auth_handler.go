package handler

import (
	"finance-tracker/internal/model"
	"finance-tracker/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type AuthHandler struct {
	authService *service.AuthService
	validate    *validator.Validate
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		validate:    validator.New(),
	}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req model.RegisterRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse("invalid request body"))
		return
	}

	if err := h.validate.Struct(req); err != nil {
		validationErrors := err.(validator.ValidationErrors)
		c.JSON(http.StatusBadRequest, model.ErrorResponse(formatValidationError(validationErrors)))
		return
	}

	res, err := h.authService.Register(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusCreated, model.SuccessResponse("registration successful", res))
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req model.LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse("invalid request body"))
		return
	}

	if err := h.validate.Struct(req); err != nil {
		validationErrors := err.(validator.ValidationErrors)
		c.JSON(http.StatusBadRequest, model.ErrorResponse(formatValidationError(validationErrors)))
		return
	}

	res, err := h.authService.Login(req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, model.ErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, model.SuccessResponse("login successful", res))
}

func formatValidationError(errs validator.ValidationErrors) string {
	for _, e := range errs {
		switch e.Tag() {
		case "required":
			return e.Field() + " is required"
		case "email":
			return e.Field() + " must be a valid email"
		case "min":
			return e.Field() + " must be at least " + e.Param() + " characters"
		case "max":
			return e.Field() + " must be at most " + e.Param() + " characters"
		}
	}

	return "validation failed"
}

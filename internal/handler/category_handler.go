package handler

import (
	"finance-tracker/internal/model"
	"finance-tracker/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type CategoryHandler struct {
	categoryService *service.CategoryService
	validate        *validator.Validate
}

func NewCategoryHandler(categoryService *service.CategoryService) *CategoryHandler {
	return &CategoryHandler{
		categoryService: categoryService,
		validate:        validator.New(),
	}
}

func (h *CategoryHandler) Create(c *gin.Context) {
	var req model.CreateCategoryRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse("invalid request body"))
		return
	}

	if err := h.validate.Struct(req); err != nil {
		validationErrors := err.(validator.ValidationErrors)
		c.JSON(http.StatusBadRequest, model.ErrorResponse(formatCategoryValidationError(validationErrors)))
		return
	}

	category, err := h.categoryService.Create(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusCreated, model.SuccessResponse("category created successfully", category))
}

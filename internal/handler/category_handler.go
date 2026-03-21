package handler

import (
	"finance-tracker/internal/model"
	"finance-tracker/internal/service"
	"net/http"
	"strconv"

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

func (h *CategoryHandler) GetAll(c *gin.Context) {
	categories, err := h.categoryService.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, model.ErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, model.SuccessResponse("categories retrieved successfully", categories))
}

func (h *CategoryHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse("invalid category id"))
		return
	}

	category, err := h.categoryService.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, model.ErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, model.SuccessResponse("category retrieved successfully", category))
}

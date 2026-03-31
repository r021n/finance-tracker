package handler

import (
	"finance-tracker/internal/model"
	"finance-tracker/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type TransactionHandler struct {
	transactionService *service.TransactionService
	validate           *validator.Validate
}

func NewTransactionHandler(transactionService *service.TransactionService) *TransactionHandler {
	return &TransactionHandler{
		transactionService: transactionService,
		validate:           validator.New(),
	}
}

func (h *TransactionHandler) Create(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var req model.CreateTransactionRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse("invalid request body"))
		return
	}

	if err := h.validate.Struct(req); err != nil {
		validationErrors := err.(validator.ValidationErrors)
		c.JSON(http.StatusBadRequest, model.ErrorResponse(formatTransactionValidationError(validationErrors)))
		return
	}

	transaction, err := h.transactionService.Create(userID, req)
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusCreated, model.SuccessResponse("transaction created successfully", transaction))
}

func formatTransactionValidationError(errs validator.ValidationErrors) string {
	for _, e := range errs {
		field := e.Field()
		switch e.Tag() {
		case "required":
			return field + " is required"
		case "oneof":
			return field + " must be either 'income' or 'expense' "
		case "gt":
			return field + " must be greater than 0"
		case "max":
			return field + " must be at most " + e.Param() + " characters"
		case "datetime":
			return field + " must be in format YYYY-MM-DD"
		}
	}
	return "validation failed"
}

package handler

import (
	"finance-tracker/internal/model"
	"finance-tracker/internal/service"
	"net/http"
	"strconv"

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

func (h *TransactionHandler) GetAll(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var filter model.TransactionFilter
	if err := c.ShouldBindJSON(&filter); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse("invalid query parameters"))
		return
	}

	transactions, meta, err := h.transactionService.GetAll(userID, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, model.ErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, model.SuccessResponseWithMeta("transactions retrieved successfully", transactions, meta))
}

func (h *TransactionHandler) GetById(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse("invalid transaction id"))
		return
	}

	transaction, err := h.transactionService.GetByID(uint(id), userID)
	if err != nil {
		if err.Error() == "transaction not found" {
			c.JSON(http.StatusNotFound, model.ErrorResponse(err.Error()))
			return
		}
		c.JSON(http.StatusInternalServerError, model.ErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, model.SuccessResponse("transaction retrieved successfully", transaction))
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

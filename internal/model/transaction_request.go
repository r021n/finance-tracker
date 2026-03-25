package model

type CreateTransactionRequest struct {
	CategoryID uint    `json:"category_id" validate:"required"`
	Type       string  `json:"type" validate:"required,oneof=income expense"`
	Amount     float64 `json:"amount" validate:"required,gt=0"`
	Note       string  `json:"note" validate:"max=500"`
	Date       string  `json:"date" validate:"required,datetime=2006-01-02"`
}

type UpdateTransactionRequest struct {
	CategoryID uint    `json:"category_id" validate:"required"`
	Type       string  `json:"type" validate:"required,oneof=income expense"`
	Amount     float64 `json:"amount" validate:"required,gt=0"`
	Note       string  `json:"note" validate:"max=500"`
	Date       string  `json:"date" validate:"required,datetime=2006-01-02"`
}

type TransactionFilter struct {
	CategoryID uint    `form:"category_id"`
	Type       string  `form:"type"`
	StartDate  string  `form:"start_date"`
	EndDate    string  `form:"end_date"`
	MinAmount  float64 `form:"min_amount"`
	MaxAmount  float64 `form:"max_amount"`
	Page       int     `form:"page"`
	Limit      int     `form:"limit"`
}

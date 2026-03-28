package service

import (
	"errors"
	"finance-tracker/internal/model"
	"finance-tracker/internal/repository"
	"time"

	"gorm.io/gorm"
)

type TransactionService struct {
	transactionRepo *repository.TransactionRepository
	categoryRepo    *repository.CategoryRepository
}

func NewTransactionService(
	transactionRepo *repository.TransactionRepository,
	categoryRepo *repository.CategoryRepository,
) *TransactionService {
	return &TransactionService{
		transactionRepo: transactionRepo,
		categoryRepo:    categoryRepo,
	}
}

func (s *TransactionService) Create(userID uint, req model.CreateTransactionRequest) (*model.Transaction, error) {
	_, err := s.categoryRepo.FindByID(req.CategoryID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("category not found")
		}
		return nil, errors.New("failed to validate category")
	}

	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		return nil, errors.New("invalid date format, use YYYY-MM-DD")
	}

	transaction := &model.Transaction{
		UserID:     userID,
		CategoryID: req.CategoryID,
		Type:       req.Type,
		Amount:     req.Amount,
		Note:       req.Note,
		Date:       date,
	}

	if err := s.transactionRepo.Create(transaction); err != nil {
		return nil, errors.New("failed to create transaction")
	}

	created, err := s.transactionRepo.FindByID(transaction.ID)
	if err != nil {
		return nil, errors.New("failed to fetch created transaction")
	}

	return created, nil
}

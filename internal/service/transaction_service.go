package service

import (
	"errors"
	"finance-tracker/internal/model"
	"finance-tracker/internal/repository"
	"math"
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

func (s *TransactionService) GetByID(id uint, userID uint) (*model.Transaction, error) {
	transaction, err := s.transactionRepo.FindByIDAndUserID(id, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("transaction not found")
		}
		return nil, errors.New("failed to fetch transaction")
	}

	return transaction, nil
}

func (s *TransactionService) GetAll(userID uint, filter model.TransactionFilter) ([]model.Transaction, *model.Meta, error) {
	if filter.Page <= 0 {
		filter.Page = 1
	}
	if filter.Limit <= 0 {
		filter.Limit = 10
	}
	if filter.Limit > 100 {
		filter.Limit = 100
	}

	transactions, total, err := s.transactionRepo.FindAllByUserID(userID, filter)
	if err != nil {
		return nil, nil, errors.New("failed to fetch transactions")
	}

	totalPages := int(math.Ceil(float64(total) / float64(filter.Limit)))

	meta := &model.Meta{
		CurrentPage: filter.Page,
		PerPage:     filter.Limit,
		TotalItems:  total,
		TotalPages:  totalPages,
	}

	return transactions, meta, nil
}

func (s *TransactionService) Update(id uint, userID uint, req model.UpdateTransactionRequest) (*model.Transaction, error) {
	transaction, err := s.transactionRepo.FindByIDAndUserID(id, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("transaciton not found")
		}
		return nil, errors.New("failed to fetch transaction")
	}

	_, err = s.categoryRepo.FindByID(req.CategoryID)
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

	transaction.CategoryID = req.CategoryID
	transaction.Type = req.Type
	transaction.Amount = req.Amount
	transaction.Note = req.Note
	transaction.Date = date

	if err := s.transactionRepo.Update(transaction); err != nil {
		return nil, errors.New("failed to update transaction")
	}

	updated, err := s.transactionRepo.FindByIDAndUserID(id, userID)
	if err != nil {
		return nil, errors.New("failed to fetch updated transaction")
	}

	return updated, nil
}

func (s *TransactionService) Delete(id uint, userID uint) error {
	_, err := s.transactionRepo.FindByIDAndUserID(id, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("transaciton not found")
		}
		return errors.New("failed to fetch transaction")
	}

	if err := s.transactionRepo.Delete(id, userID); err != nil {
		return errors.New("failed to delete transaction")
	}

	return nil
}

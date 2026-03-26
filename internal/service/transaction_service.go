package service

import "finance-tracker/internal/repository"

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

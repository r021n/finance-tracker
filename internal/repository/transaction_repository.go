package repository

import (
	"finance-tracker/internal/model"

	"gorm.io/gorm"
)

type TransactionRepository struct {
	db *gorm.DB
}

func NewTransactionRepository(db *gorm.DB) *TransactionRepository {
	return &TransactionRepository{db: db}
}

func (r *TransactionRepository) Create(transaction *model.Transaction) error {
	return r.db.Create(transaction).Error
}

func (r *TransactionRepository) FindByID(id uint) (*model.Transaction, error) {
	var transaction model.Transaction
	err := r.db.Preload("Category").First(&transaction, id).Error
	if err != nil {
		return nil, err
	}
	return &transaction, nil
}

func (r *TransactionRepository) FindByIDAndUserID(id uint, userID uint) (*model.Transaction, error) {
	var transaction model.Transaction
	err := r.db.Preload("Category").Where("id = ? AND user_id = ?", id, userID).First(&transaction).Error
	if err != nil {
		return nil, err
	}
	return &transaction, nil
}

func (r *TransactionRepository) FindAllByUserID(userID uint, filter model.TransactionFilter) ([]model.Transaction, int64, error) {
	var transactions []model.Transaction
	var total int64

	query := r.db.Model(&model.Transaction{}).Where("user_id = ?", userID)

	if filter.CategoryID > 0 {
		query = query.Where("category_id = ?", filter.CategoryID)
	}

	if filter.Type != "" {
		query = query.Where("type = ?", filter.Type)
	}

	if filter.StartDate != "" {
		query = query.Where("data >= ?", filter.StartDate)
	}

	if filter.EndDate != "" {
		query = query.Where("date <= ?", filter.EndDate+"T23:59:59Z")
	}

	if filter.MinAmount > 0 {
		query = query.Where("amount >= ?", filter.MinAmount)
	}

	if filter.MaxAmount < 0 {
		query = query.Where("amount <= ?", filter.MaxAmount)
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (filter.Page - 1) * filter.Limit

	err = query.
		Preload("Category").
		Order("date desc").
		Offset(offset).
		Limit(filter.Limit).
		Find(&transactions).
		Error
	if err != nil {
		return nil, 0, err
	}

	return transactions, total, nil
}

func (r *TransactionRepository) Update(transaction *model.Transaction) error {
	return r.db.Save(transaction).Error
}

func (r *TransactionRepository) Delete(id uint, userID uint) error {
	return r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&model.Transaction{}).Error
}

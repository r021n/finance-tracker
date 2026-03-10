package service

import (
	"errors"
	"finance-tracker/internal/model"
	"finance-tracker/internal/repository"

	"gorm.io/gorm"
)

type CategoryService struct {
	categoryRepo *repository.CategoryRepository
}

func NewCategoryService(categoryRepo *repository.CategoryRepository) *CategoryService {
	return &CategoryService{categoryRepo: categoryRepo}
}

func (s *CategoryService) Create(req model.CreateCategoryRequest) (*model.Category, error) {
	existing, _ := s.categoryRepo.FindByName(req.Name)
	if existing != nil {
		return nil, errors.New("category name already exists")
	}

	category := &model.Category{
		Name: req.Name,
	}

	if err := s.categoryRepo.Create(category); err != nil {
		return nil, errors.New("failed to create category")
	}

	return category, nil
}

func (s *CategoryService) GetAll() ([]model.Category, error) {
	categories, err := s.categoryRepo.FindAll()
	if err != nil {
		return nil, errors.New("failed to fetch categories")
	}
	return categories, nil
}

func (s *CategoryService) GetByID(id uint) (*model.Category, error) {
	category, err := s.categoryRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("category not found")
		}
		return nil, errors.New("failed to fetch category")
	}
	return category, nil
}

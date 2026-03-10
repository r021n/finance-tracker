package service

import (
	"errors"
	"finance-tracker/internal/model"
	"finance-tracker/internal/repository"
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

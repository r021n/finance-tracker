package model

type CreateCategoryRequest struct {
	Name string `json:"name" validate:"required,min=2,max=100"`
}

type UpdateCategoryRequest struct {
	Name string `json:"name" validate:"required,min=2,max=100"`
}

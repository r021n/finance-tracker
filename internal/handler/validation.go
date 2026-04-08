package handler

import "github.com/go-playground/validator/v10"

func FormatValidationError(errs validator.ValidationErrors) string {
	for _, e := range errs {
		field := e.Field()
		switch e.Tag() {
		case "required":
			return field + " is required"
		case "email":
			return field + " must be a valid email"
		case "min":
			return field + " must be at least " + e.Param() + " characters"
		case "max":
			return field + " must be at most " + e.Param() + " characters"
		case "oneof":
			return field + " must be one of: " + e.Param()
		case "gt":
			return field + " must be greater than " + e.Param()
		case "datetime":
			return field + " must be in format YYYY-MM-DD"
		}
	}
	return "validation failed"
}

package model

type Response struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Meta    *Meta       `json:"meta,omitempty"`
}

type Meta struct {
	CurrentPage int   `json:"current_page"`
	PerPage     int   `json:"per_page"`
	TotalItems  int64 `json:"total_items"`
	TotalPages  int   `json:"total_pages"`
}

func SuccessResponse(message string, data interface{}) Response {
	return Response{
		Status:  "success",
		Message: message,
		Data:    data,
	}
}

func SuccessResponseWithMeta(message string, data interface{}, meta *Meta) Response {
	return Response{
		Status:  "success",
		Message: message,
		Data:    data,
		Meta:    meta,
	}
}

func ErrorResponse(message string) Response {
	return Response{
		Status:  "error",
		Message: message,
	}
}

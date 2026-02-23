package model

import "time"

type Transaction struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	UserID     uint      `json:"user_id" gorm:"not null;index"`
	CategoryID uint      `json:"category_id" gorm:"not null;index"`
	Type       string    `json:"type" gorm:"type:varchar(20);not null"`
	Amount     float64   `json:"amount" gorm:"type:decimal(15,2);not null"`
	Note       string    `json:"note" gorm:"type:text"`
	Date       time.Time `json:"date" gorm:"not null;index"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`

	User     User     `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Category Category `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
}

package model

import "time"

type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"type:varchar(255);not null"`
	Email     string    `json:"email" gorm:"type:varchar(255);uniqueIndex;not null"`
	Password  string    `json:"-" gorm:"type:varchar(255);not null"`
	Role      string    `json:"role" gorm:"type:varchar(20);default:'user';not null"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

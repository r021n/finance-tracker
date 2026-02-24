package main

import (
	"finance-tracker/internal/config"
	"finance-tracker/internal/model"
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	db, err := gorm.Open(postgres.Open(cfg.GetDSN()), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Failed to get database instance: %v", err)
	}
	defer sqlDB.Close()

	log.Println("Connected to database successfully")

	err = db.AutoMigrate(&model.User{}, &model.Category{}, &model.Transaction{})
	if err != nil {
		log.Fatalf("Failed to run auto migration: %v", err)
	}

	log.Println("Migration completed successfully")

	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, model.SuccessResponse("server is running", nil))
	})

	addr := fmt.Sprintf(":%s", cfg.ServerPort)
	log.Printf("Server starting on %s", addr)

	if err := r.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

package main

import (
	"finance-tracker/internal/config"
	"finance-tracker/internal/handler"
	"finance-tracker/internal/middleware"
	"finance-tracker/internal/model"
	"finance-tracker/internal/repository"
	"finance-tracker/internal/service"
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

	userRepo := repository.NewUserRepository(db)
	categoryRepo := repository.NewCategoryRepository(db)
	transactionRepo := repository.NewTransactionRepository(db)

	authService := service.NewAuthService(userRepo, cfg.JWTSecret)
	categoryService := service.NewCategoryService(categoryRepo)
	transactionService := service.NewTransactionService(transactionRepo, categoryRepo)

	if err := categoryService.Seed(); err != nil {
		log.Printf("Warning: failed to seed categories: %v", err)
	} else {
		log.Println("Categories seeded successfully")
	}

	authHandler := handler.NewAuthHandler(authService)
	categoryHandler := handler.NewCategoryHandler(categoryService)
	transactionHandler := handler.NewTransactionHandler(transactionService)

	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, model.SuccessResponse("server is running", nil))
	})

	auth := r.Group("/api/auth")
	{
		auth.POST("/register", authHandler.Register)
		auth.POST("/login", authHandler.Login)
	}

	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware(cfg.JWTSecret))
	{
		protected.GET("/profile", func(c *gin.Context) {
			userID, _ := c.Get("user_id")
			email, _ := c.Get("email")
			role, _ := c.Get("role")

			c.JSON(200, model.SuccessResponse("profile retrieved", gin.H{
				"user_id": userID,
				"email":   email,
				"role":    role,
			}))
		})
		protected.GET("/categories", categoryHandler.GetAll)
		protected.GET("/categories/:id", categoryHandler.GetByID)

		protected.POST("/transactions", transactionHandler.Create)
		protected.GET("/transactions", transactionHandler.GetAll)
		protected.GET("/transactions/:id", transactionHandler.GetByID)
		protected.PUT("/transactions/:id", transactionHandler.Update)
		protected.DELETE("/transactions/:id", transactionHandler.Delete)
	}

	admin := r.Group("/api/admin")
	admin.Use(middleware.AuthMiddleware(cfg.JWTSecret))
	admin.Use(middleware.AdminMiddleware())
	{
		admin.GET("/dashboard", func(c *gin.Context) {
			c.JSON(200, model.SuccessResponse("welcome admin", nil))
		})
		admin.POST("/categories", categoryHandler.Create)
		admin.PUT("/categories/:id", categoryHandler.Update)
		admin.DELETE("/categories/:id", categoryHandler.Delete)
	}

	addr := fmt.Sprintf(":%s", cfg.ServerPort)
	log.Printf("Server starting on %s", addr)

	if err := r.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

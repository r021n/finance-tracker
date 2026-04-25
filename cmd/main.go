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
	"go.uber.org/zap"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	logger, err := config.NewDevelopmentLogger()
	if err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}
	defer logger.Sync()

	db, err := gorm.Open(postgres.Open(cfg.GetDSN()), &gorm.Config{})
	if err != nil {
		logger.Fatal("Failed to connect to database", zap.Error(err))
	}

	sqlDB, err := db.DB()
	if err != nil {
		logger.Fatal("Failed to get database instance", zap.Error(err))
	}
	defer sqlDB.Close()

	logger.Info("Connected to database successfully")

	err = db.AutoMigrate(&model.User{}, &model.Category{}, &model.Transaction{})
	if err != nil {
		logger.Fatal("Failed to run auto migration", zap.Error(err))
	}

	logger.Info("Migration completed successfully")

	userRepo := repository.NewUserRepository(db)
	categoryRepo := repository.NewCategoryRepository(db)
	transactionRepo := repository.NewTransactionRepository(db)

	authService := service.NewAuthService(userRepo, cfg.JWTSecret)
	categoryService := service.NewCategoryService(categoryRepo)
	transactionService := service.NewTransactionService(transactionRepo, categoryRepo)

	if err := categoryService.Seed(); err != nil {
		logger.Warn("Failed to seed categories", zap.Error(err))
	} else {
		logger.Info("Categories seeded successfully")
	}

	authHandler := handler.NewAuthHandler(authService)
	categoryHandler := handler.NewCategoryHandler(categoryService)
	transactionHandler := handler.NewTransactionHandler(transactionService)

	gin.SetMode(gin.ReleaseMode)
	r := gin.New()

	r.Use(middleware.CORSMiddleware())
	r.Use(middleware.RecoveryMiddleware(logger))
	r.Use(middleware.LoggerMiddleware(logger))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, model.SuccessResponse("server is running", nil))
	})

	r.NoRoute(func(c *gin.Context) {
		model.RespondNotFound(c, "route not found")
	})

	r.NoMethod(func(c *gin.Context) {
		model.RespondError(c, 405, "method not allowed")
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
	logger.Info("Server starting", zap.String("address", addr))

	if err := r.Run(addr); err != nil {
		logger.Fatal("Failed to start server", zap.Error(err))
	}
}

package main

import (
	"dao-backend/controllers"
	"dao-backend/models"
	"dao-backend/pkg/database"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"os"
	"strings"
	"time"
)

func init() {
	err_env := godotenv.Load()
	if err_env != nil {
		log.Fatal("Error loading .env file")
	}
	db, _ := database.Connect()
	db.AutoMigrate(&models.Voting{})
}

func main() {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     strings.Split(os.Getenv("SERVER_CORS_ALLOW_ORIGINS"), ","),
		AllowMethods:     strings.Split(os.Getenv("SERVER_CORS_ALLOW_METHODS"), ","),
		AllowHeaders:     strings.Split(os.Getenv("SERVER_CORS_ALLOW_HEADERS"), ","),
		ExposeHeaders:    strings.Split(os.Getenv("SERVER_CORS_ALLOW_EXPOSE_HEADERS"), ","),
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "https://github.com"
		},
		MaxAge: 12 * time.Hour,
	}))
	r.GET("/", controllers.Index)
	r.GET("/voting/:address", controllers.GetVoting)
	r.POST("/voting", controllers.CreateVoting)
	r.Run(os.Getenv("SERVER_HOST") + ":" + os.Getenv("SERVER_PORT"))
}

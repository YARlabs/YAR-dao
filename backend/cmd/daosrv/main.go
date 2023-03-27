package main

import (
	"dao-backend/controllers"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"os"
)

func init() {
	err_env := godotenv.Load()
	if err_env != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	r := gin.Default()
	r.GET("/", controllers.Index)
	r.GET("/voting/:address", controllers.GetVoting)
	r.POST("/voting", controllers.CreateVoting)
	r.Run(os.Getenv("SERVER_HOST") + ":" + os.Getenv("SERVER_PORT"))
}

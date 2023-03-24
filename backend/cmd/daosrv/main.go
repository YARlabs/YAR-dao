package main

import (
	"dao-backend/models"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	_ "gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"os"
)

var db *gorm.DB
var err error

func main() {
	err_env := godotenv.Load()
	if err_env != nil {
		log.Fatal("Error loading .env file")
	}

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("POSTGRES_HOST"),
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_DB"),
		os.Getenv("POSTGRES_PORT"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalln(err)
	}
	//defer db.Close()
	db.AutoMigrate(&models.Voting{})
	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, "YAR DAO SERVER")
	})
	r.GET("/voting/:address", GetVoting)
	r.POST("/voting", CreateVoting)
	r.Run(":10080")
}

func CreateVoting(c *gin.Context) {
	var voting models.Voting
	//voting_data := Voting{Address: "Jinzhu123", PublicAddress: "18", Signature: "sasdsdf", Description: "trwwww"}
	c.BindJSON(&voting)
	db.Create(&voting)
	c.JSON(200, voting)
}
func GetVoting(c *gin.Context) {
	address := c.Params.ByName("address")
	var voting models.Voting
	err := db.Where("address = ?", address).First(&voting).Error
	if err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
		return
	} else {
		c.JSON(200, voting)
	}
}

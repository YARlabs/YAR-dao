package main

import (
	"dao-backend/models"
	"dao-backend/utils"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"net/http"
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

	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalln(err)
	}

	db.AutoMigrate(&models.Voting{})
	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, "YAR DAO SERVER")
	})
	r.GET("/voting/:address", GetVoting)
	r.POST("/voting", CreateVoting)
	r.Run(os.Getenv("SERVER_HOST") + ":" + os.Getenv("SERVER_PORT"))
}

func CreateVoting(c *gin.Context) {
	var voting models.Voting
	c.BindJSON(&voting)
	sigAprove := utils.VerifySig(
		voting.PublicAddress,
		voting.Signature,
		[]byte(voting.Address+voting.Description),
	)

	if sigAprove == true {
		db.Create(&voting)
		c.JSON(http.StatusOK, voting)
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Sig not verify"})
	}
}

func GetVoting(c *gin.Context) {
	address := c.Params.ByName("address")
	var voting models.Voting
	result := db.First(&voting, "address = ?", address)
	if result.Error != nil {
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, voting)
	}
}

package controllers

import (
	"dao-backend/models"
	"dao-backend/pkg/database"
	_ "dao-backend/pkg/database"
	"dao-backend/pkg/w3"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Index(c *gin.Context) {
	c.JSON(http.StatusOK, "YAR DAO SERVER")
}

func CreateVoting(c *gin.Context) {
	db, _ := database.Connect()
	var voting models.Voting
	c.BindJSON(&voting)
	sigAprove := w3.VerifySig(
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
	db, _ := database.Connect()
	address := c.Params.ByName("address")
	var voting models.Voting
	result := db.First(&voting, "address = ?", address)
	if result.Error != nil {
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, voting)
	}
}

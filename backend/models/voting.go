package models

type Voting struct {
	Address       string `json:"address" gorm:"column:address;type:varchar(42);primaryKey"`
	PublicAddress string `json:"public_address" gorm:"column:public_address;type:varchar(42)"`
	Signature     string `json:"signature" gorm:"column:signature;type:text"`
	Description   string `json:"description" gorm:"column:description;type:text"`
}

package entity

type UserLogin struct {
	Model

	UserPID  string `json:"userPid" gorm:"size:8"`
	Password string `json:"-"`

	UserLoginRoleID *uint          `json:"userLoginRoleId"`
	UserLoginRole   *UserLoginRole `json:"userLoginRole" gorm:"references:ID"`
}

type UserLoginRole struct {
	ID   uint   `json:"id" gorm:"primaryKey"`
	Role string `json:"role" gorm:"uniqueIndex; size:16"`

	UserLogins []*UserLogin `gorm:"foreignKey:UserLoginRoleID" json:"-"`
}

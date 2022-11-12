package entity

type NameTitle struct {
	ID    uint   `json:"id" gorm:"primaryKey"`
	Title string `json:"title" gorm:"size:32; uniqueIndex"`

	Students []Student `json:"-" gorm:"foreignKey:NameTitleID"`
	Advisors []Advisor `json:"-" gorm:"foreignKey:NameTitleID"`
}

type Student struct {
	Model

	UserLoginID *uint      `json:"userLoginId"`
	UserLogin   *UserLogin `json:"userLogin" gorm:"references:ID"`

	NameTitleID *uint      `json:"nameTitleId"`
	NameTitle   *NameTitle `json:"nameTitle" gorm:"references:ID"`

	FirstName  string `json:"firstName"`
	LastName   string `json:"lastName"`
	StudentPID string `json:"studentPid" gorm:"uniqueIndex; size:8"`

	AdvisorID *uint    `json:"advisorId"`
	Advisor   *Advisor `json:"advisor" gorm:"references:ID"`

	OnGoing   bool `json:"onGoing"`
	Completed bool `json:"completed"`

	Projects        []*Project        `json:"projects" gorm:"many2many:project_students"`
	ProjectStudents []*ProjectStudent `json:"projectStudents" gorm:"foreignKey:StudentID"`
}

type AcademicNameTitle struct {
	ID         uint   `json:"id" gorm:"primaryKey"`
	Title      string `json:"title" gorm:"size:32; uniqueIndex"`
	TitleShort string `json:"titleShort" gorm:"size:32"`

	Advisors []*Advisor `json:"-" gorm:"foreignKey:AcademicNameTitleID"`
}

type Advisor struct {
	Model

	UserLoginID *uint      `json:"userLoginId"`
	UserLogin   *UserLogin `json:"userLogin" gorm:"references:ID; constraint:OnDelete:CASCADE; OnUpdate:CASCADE"`

	AcademicNameTitleID *uint              `json:"academicNameTitleId"`
	AcademicNameTitle   *AcademicNameTitle `json:"academicNameTitle" gorm:"references:ID"`

	NameTitleID *uint      `json:"nameTitleId"`
	NameTitle   *NameTitle `json:"nameTitle" gorm:"references:ID"`

	FirstName  string `json:"firstName"`
	LastName   string `json:"lastName"`
	AdvisorPID string `json:"advisorPid" gorm:"uniqueIndex; size:6"`
	Email      string `json:"email" gorm:"uniqueIndex; size:6"`

	Projects []*Project `json:"projects" gorm:"foreignKey:AdvisorID"`

	Students []*Student `json:"students" gorm:"foreignKey:AdvisorID"`
}

type Admin struct {
	Model

	Username string `json:"username" gorm:"uniqueIndex"`
	Password string `json:"-"`
}

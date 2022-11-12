package entity

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func SetupDatabase() {
	database, err := gorm.Open(sqlite.Open("cpe-project-management.db"), &gorm.Config{
		SkipDefaultTransaction: true,
	})
	if err != nil {
		panic("failed to connect database")
	}

	if err := database.SetupJoinTable(&Project{}, "Students", &ProjectStudent{}); err != nil {
		panic("failed to setup join table")
	}

	if err := database.SetupJoinTable(&Student{}, "Projects", &ProjectStudent{}); err != nil {
		panic("failed to setup join table")
	}

	database.AutoMigrate(
		// user login
		&UserLogin{},
		&UserLoginRole{},

		// users
		&Admin{},
		&NameTitle{},
		&Student{},
		&AcademicNameTitle{},
		&Advisor{},

		// project
		&AcademicYear{},
		&AcademicYearSemester{},
		&Config{},
		&Grade{},
		&ProjectStatus{},
		&Project{},
		&ProjectMeetingStatus{},
		&ProjectMeeting{},
		&ProjectStudent{},
		&ProjectDefenseRequest{},
		&ProjectDefenseRequestStatus{},
		&ProjectDefenseResult{},
		&ProjectDefenseFileStorage{},
	)

	// SetupPrepareData(database)

	db = database
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

func SetupPrepareData(database *gorm.DB) {

	adminPassword, err := HashPassword("cpeproject")
	if err != nil {
		panic("error hashing password")
	}
	database.Model(&Admin{}).Create(&Admin{
		Username: "admin",
		Password: adminPassword,
	})

	var userRoles = []string{
		"Advisor", "Student",
	}
	for _, item := range userRoles {
		database.Model(&UserLoginRole{}).Create(&UserLoginRole{
			Role: item,
		})
	}

	var projectStatuses = []string{
		"กำลังดำเนินการ", "ผ่าน (S)", "ไม่ผ่าน (U)", "การประเมินยังไม่สิ้นสุด (P)",
	}
	for _, item := range projectStatuses {
		database.Model(&ProjectStatus{}).Create(&ProjectStatus{
			Status: item,
		})
	}

	var projectMeetingStatuses = []string{
		"ตรวจทานเรียบร้อย", "ไม่ผ่าน", "อยู่ระหว่างการตรวจทาน",
	}
	for _, item := range projectMeetingStatuses {
		database.Model(&ProjectMeetingStatus{}).Create(&ProjectMeetingStatus{
			Status: item,
		})
	}

	var nameTitles = []string{
		"", "นาย", "นาง", "นางสาว", "ดร.",
	}
	for _, item := range nameTitles {
		database.Model(&NameTitle{}).Create(&NameTitle{
			Title: item,
		})
	}

	var academicNameTitles = [][]string{
		{"", ""}, {"ศาสตราจารย์", "ศ."}, {"รองศาสตราจารย์", "รศ."}, {"ผู้ช่วยศาสตราจารย์", "ผศ."}, {"อาจารย์", "อ."},
	}
	for _, item := range academicNameTitles {
		database.Model(&AcademicNameTitle{}).Create(&AcademicNameTitle{
			Title:      item[0],
			TitleShort: item[1],
		})
	}

	for i := 0; i < 5; i++ {
		database.Model(&AcademicYear{}).Create(&AcademicYear{
			Year:        uint16(i + 2561),
			MaxSemester: 3,
		})
	}

	for i := 0; i < 5; i++ {
		for j := 1; j <= 3; j++ {
			database.Model(&AcademicYearSemester{}).Create(&AcademicYearSemester{
				Year:     uint16(i + 2561),
				Semester: uint8(j),
			})
		}

	}

	var currentAcademicYearSemester AcademicYearSemester
	database.Model(&AcademicYearSemester{}).Where("year = ? AND semester = ?", 2565, 1).Find(&currentAcademicYearSemester)
	var initConfig = Config{
		CurrentAcademicYearSemester: &currentAcademicYearSemester,
		MaxProjectMeetingItem:       4,
	}
	database.Model(&Config{}).Create(&initConfig)

	var projectDefenseReqStatus = []string{
		"อนุมัติ", "ไม่อนุมัติ", "อยู่ระหว่างการอนุมัติ",
	}
	for _, item := range projectDefenseReqStatus {
		database.Model(&ProjectDefenseRequestStatus{}).Create(&ProjectDefenseRequestStatus{
			Status: item,
		})
	}

	var gradeValueStrings = []string{
		"", "S", "U", "P",
	}
	for _, item := range gradeValueStrings {
		database.Model(&Grade{}).Create(&Grade{
			GradeValue: item,
		})
	}
}

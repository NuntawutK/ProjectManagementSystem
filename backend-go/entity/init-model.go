package entity

import (
	"time"

	"gorm.io/gorm"
)

type Model struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt,omitempty" gorm:"index"`
}

type AcademicYearSemester struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	Year     uint16 `json:"year"`
	Semester uint8  `json:"semester"`

	StartProjects          []*Project               `json:"-" gorm:"foreignKey:StartAcademicYearSemesterID"`
	GradingProjects        []*Project               `json:"-" gorm:"foreignKey:GradingAcademicYearSemesterID"`
	FinishProjects         []*Project               `json:"-" gorm:"foreignKey:FinishAcademicYearSemesterID"`
	ProjectMeetings        []*ProjectMeeting        `json:"-" gorm:"foreignKey:AssignmentAcademicYearSemesterID"`
	ProjectDefenseRequests []*ProjectDefenseRequest `json:"-" gorm:"foreignKey:RequestAcademicYearSemesterID"`
	ProjectDefenseResults  []*ProjectDefenseResult  `json:"-" gorm:"foreignKey:ResultAcademicYearSemesterID"`
	Configs                []*Config                `json:"-" gorm:"foreignKey:CurrentAcademicYearSemesterID"`
}

type AcademicYear struct {
	Year        uint16 `json:"year" gorm:"primaryKey"`
	MaxSemester uint8  `json:"maxSemester"`

	AcademicYearSemesters []*AcademicYearSemester `json:"-" gorm:"foreignKey:Year; references:Year"`
}

type Config struct {
	Model

	CurrentAcademicYearSemesterID *uint                 `json:"currentAcademicYearSemesterId"`
	CurrentAcademicYearSemester   *AcademicYearSemester `json:"currentAcademicYearSemester" gorm:"references:ID"`

	MaxProjectMeetingItem uint8 `json:"maxProjectMeetingItem"`
}

type Grade struct {
	ID         uint   `json:"id" gorm:"primaryKey"`
	GradeValue string `json:"gradeValue" gorm:"uniqueIndex; size:4"`

	ProjectDefenseResults []*ProjectDefenseResult `json:"-" gorm:"foreignKey:GradeID"`
}

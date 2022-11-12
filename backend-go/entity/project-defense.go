package entity

type ProjectDefenseRequest struct {
	Model

	ProjectStudentID *uint           `json:"projectStudentId"`
	ProjectStudent   *ProjectStudent `json:"projectStudent" gorm:"references:ID"`

	RequestAcademicYearSemesterID *uint                 `json:"requestAcademicYearSemesterId"`
	RequestAcademicYearSemester   *AcademicYearSemester `json:"requestAcademicYearSemester" gorm:"references:ID"`

	PartOfSubject     bool   `json:"partOfSubject"`
	PartOfSubjectName string `json:"partOfSubjectName"`

	ProjectDefenseRequestStatusID       *uint                        `json:"projectDefenseRequestStatusId"`
	ProjectDefenseRequestStatus         *ProjectDefenseRequestStatus `json:"projectDefenseRequestStatus" gorm:"references:ID"`
	ProjectDefenseRequestStatusAccepted bool                         `json:"projectDefenseRequestStatusAccepted"`
	ProjectDefenseRequestStatusMessage  string                       `json:"projectDefenseRequestStatusMessage"`

	ProjectDefenseFileStorages []*ProjectDefenseFileStorage `json:"projectDefenseFileStorages" gorm:"foreignKey:ProjectDefenseRequestID"`
}

type ProjectDefenseFileStorage struct {
	Model

	ProjectDefenseRequestID *uint                  `json:"projectDefenseRequestId"`
	ProjectDefenseRequest   *ProjectDefenseRequest `json:"projectDefenseRequest" gorm:"references:ID"`

	FileName string `json:"fileName"`
	FileData string `json:"fileData"`
}

type ProjectDefenseRequestStatus struct {
	ID     uint   `json:"id" gorm:"primaryKey"`
	Status string `json:"status" gorm:"size:64; uniqueIndex"`

	ProjectDefenseRequests []ProjectDefenseRequest `json:"-" gorm:"foreignKey:ProjectDefenseRequestStatusID"`
}

type ProjectDefenseResult struct {
	Model

	ProjectStudentID *uint           `json:"projectStudentId"`
	ProjectStudent   *ProjectStudent `json:"projectStudent" gorm:"references:ID"`

	ResultAcademicYearSemesterID *uint                 `json:"resultAcademicYearSemesterId"`
	ResultAcademicYearSemester   *AcademicYearSemester `json:"resultAcademicYearSemester" gorm:"references:ID"`

	GradeID *uint  `json:"gradeId"`
	Grade   *Grade `json:"grade" gorm:"references:ID"`
}

package entity

type ProjectStatus struct {
	ID     uint   `json:"id" gorm:"primaryKey"`
	Status string `json:"status" gorm:"size:64; uniqueIndex"`

	Projects []Project `json:"-" gorm:"foreignKey:ProjectStatusID"`
}

type ProjectMeetingStatus struct {
	ID     uint   `json:"id" gorm:"primaryKey"`
	Status string `json:"status" gorm:"size:64; uniqueIndex"`

	ProjectMeetings []*ProjectMeeting `json:"-" gorm:"foreignKey:ProjectMeetingStatusID"`
}

type Project struct {
	Model

	Name string `json:"name"`

	Students        []*Student        `json:"students" gorm:"many2many:project_students"`
	ProjectStudents []*ProjectStudent `json:"projectStudents" gorm:"foreignKey:ProjectID"`

	AdvisorID *uint    `json:"advisorId"`
	Advisor   *Advisor `json:"advisor" gorm:"references:ID"`

	StartAcademicYearSemesterID *uint                 `json:"startAcademicYearSemesterId"`
	StartAcademicYearSemester   *AcademicYearSemester `json:"startAcademicYearSemester" gorm:"references:ID"`

	GradingAcademicYearSemesterID *uint                 `json:"gradingAcademicYearSemesterId"`
	GradingAcademicYearSemester   *AcademicYearSemester `json:"gradingAcademicYearSemester" gorm:"references:ID"`

	FinishAcademicYearSemesterID *uint                 `json:"finishAcademicYearSemesterId"`
	FinishAcademicYearSemester   *AcademicYearSemester `json:"finishAcademicYearSemester" gorm:"references:ID"`

	ProjectStatusID *uint          `json:"projectStatusId"`
	ProjectStatus   *ProjectStatus `json:"projectStatus" gorm:"references:ID"`
}

type ProjectStudent struct {
	Model

	ProjectID *uint    `json:"projectId" gorm:"uniqueIndex:idx_project_student_fk"`
	Project   *Project `json:"project" gorm:"references:ID"`

	StudentID *uint    `json:"studentId" gorm:"uniqueIndex:idx_project_student_fk"`
	Student   *Student `json:"student" gorm:"references:ID"`

	ProjectMeetings []*ProjectMeeting `json:"projectMeetings" gorm:"foreignKey:ProjectStudentID; constraints:OnDelete:CASCADE"`

	ProjectDefenseRequests []*ProjectDefenseRequest `json:"projectDefenseRequests" gorm:"foreignKey:ProjectStudentID; constraints:OnDelete:CASCADE"`

	ProjectDefenseResults []*ProjectDefenseResult `json:"projectDefenseResults" gorm:"foreignKey:ProjectStudentID; constraints:OnDelete:CASCADE"`
}

type ProjectMeeting struct {
	Model

	ProjectStudentID *uint           `json:"projectStudentId"`
	ProjectStudent   *ProjectStudent `json:"projectStudent" gorm:"references:ID"`

	AssignmentToDo string `json:"assignmentToDo"`
	AssignmentDone string `json:"assignmentDone"`

	AssignmentAcademicYearSemesterID *uint                 `json:"assignmentAcademicYearSemesterId"`
	AssignmentAcademicYearSemester   *AcademicYearSemester `json:"assignmentAcademicYearSemester" gorm:"references:ID"`

	ProjectMeetingStatusID *uint                 `json:"projectMeetingStatusId"`
	ProjectMeetingStatus   *ProjectMeetingStatus `json:"projectMeetingStatus" gorm:"references:ID"`
}

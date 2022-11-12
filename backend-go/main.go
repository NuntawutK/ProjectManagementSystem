package main

import (
	"github.com/f-wntp27/cpe-project-management/backend-go/controller"
	controller_admin "github.com/f-wntp27/cpe-project-management/backend-go/controller/admin"
	controller_advisor "github.com/f-wntp27/cpe-project-management/backend-go/controller/advisor"
	controller_student "github.com/f-wntp27/cpe-project-management/backend-go/controller/student"
	"github.com/f-wntp27/cpe-project-management/backend-go/entity"
	"github.com/f-wntp27/cpe-project-management/backend-go/middleware"
	"github.com/gin-gonic/gin"
)

func main() {
	entity.SetupDatabase()

	r := gin.Default()
	r.SetTrustedProxies([]string{"http://localhost:4200"})
	r.Use(middleware.CORSMiddleware())

	api := r.Group("/api")
	{
		api.POST("/login/admin", controller_admin.Login)
		api.POST("/login/user", controller.Login)

		configRoutes := api.Group("/config", middleware.Authorizes())
		{
			configRoutes.GET("", controller.GetConfig)
			configRoutes.POST("", controller.CreateConfig)
		}

		adminRoutes := api.Group("/admin", middleware.Authorizes())
		{
			adminRoutes.GET("/academic-name-titles", controller_admin.ListAcademicNameTitle)
			adminRoutes.GET("/academic-years", controller_admin.ListAcademicYear)
			adminRoutes.GET("/name-titles", controller_admin.ListNameTitle)

			adminRoutes.GET("/advisors", controller_admin.ListAdvisor)
			adminRoutes.POST("/advisor", controller_admin.CreateAdvisor)
			adminRoutes.POST("/advisors", controller_admin.CreateAdvisorList)

			adminRoutes.GET("/students", controller_admin.ListStudent)
			adminRoutes.POST("/student", controller_admin.CreateStudent)
			adminRoutes.POST("/students", controller_admin.CreateStudentList)

			adminRoutes.GET("/projects/grade", controller_admin.ListProjectForGrading)
			adminRoutes.GET("/project-statuses", controller_admin.ListProjectStatus)

			adminRoutes.GET("/project-defense-results/:year/:semester", controller_admin.ListProjectDefenseResultByAcademicYearSemester)
			adminRoutes.POST("/project-defense-result", controller_admin.CreateProjectDefenseResult)

		}

		advisorRoutes := api.Group("/advisor", middleware.Authorizes())
		{
			advisorRoutes.GET("/user", controller_advisor.GetAdvisor)

			advisorRoutes.GET("/academic-years", controller_advisor.ListAcademicYear)

			advisorRoutes.GET("/students", controller_advisor.ListStudent)

			advisorRoutes.GET("/project/:id", controller_advisor.GetProject)
			advisorRoutes.GET("/projects/:academicYear/:semester", controller_advisor.ListProjectByAcademicYearSemester)
			advisorRoutes.GET("/projects/ongoing", controller_advisor.ListProjectByOnGoingStatus)
			advisorRoutes.POST("/project", controller_advisor.CreateProject)

			advisorRoutes.GET("/project-students")

			advisorRoutes.PATCH("/project-meeting/:id", controller_advisor.UpdateProjectMeeting)

			advisorRoutes.GET("/project-defense-requests", controller_advisor.ListProjectDefenseRequest)
			advisorRoutes.PATCH("/project-defense-request/:id", controller_advisor.UpdateProjectDefenseRequest)
		}

		studentRoutes := api.Group("/student", middleware.Authorizes())
		{
			studentRoutes.GET("/user", controller_student.GetStudent)

			studentRoutes.GET("/projects")
			studentRoutes.GET("/project")

			studentRoutes.GET("/project-student", controller_student.ListProjectStudentByStudentPID)

			studentRoutes.GET("/project-meetings/project-student/:projectStudentId", controller_student.ListProjectMeetingByProjectStudentID)
			studentRoutes.POST("/project-meetings", controller_student.CreateProjectMeetings)

			studentRoutes.GET("/project-defense-requests", controller_student.ListProjectDefenseRequest)
			studentRoutes.GET("/project-defense-requests/:id/file-name", controller_student.ListProjectDefenseFileName)
			studentRoutes.POST("/project-defense-request", controller_student.CreateProjectDefenseRequest)
			studentRoutes.PATCH("/project-defense-request/upload", controller_student.UpdateProjectDefenseRequest)

			studentRoutes.GET("/project-defense-file-storage/:id", controller_student.OpenSubmittedFiles)
			studentRoutes.DELETE("/project-defense-file-storage/:id", controller_student.DeleteSubmittedFiles)

		}
	}

	r.Run()
}

BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "user_login_roles" (
	"id"	integer,
	"role"	text,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "user_logins" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"user_p_id"	text,
	"password"	text,
	"user_login_role_id"	integer,
	CONSTRAINT "fk_user_login_roles_user_logins" FOREIGN KEY("user_login_role_id") REFERENCES "user_login_roles"("id"),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "admins" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"username"	text,
	"password"	text,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "name_titles" (
	"id"	integer,
	"title"	text,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "academic_name_titles" (
	"id"	integer,
	"title"	text,
	"title_short"	text,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "advisors" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"user_login_id"	integer,
	"academic_name_title_id"	integer,
	"name_title_id"	integer,
	"first_name"	text,
	"last_name"	text,
	"advisor_p_id"	text,
	"email"	text,
	CONSTRAINT "fk_name_titles_advisors" FOREIGN KEY("name_title_id") REFERENCES "name_titles"("id"),
	CONSTRAINT "fk_advisors_user_login" FOREIGN KEY("user_login_id") REFERENCES "user_logins"("id") ON DELETE CASCADE,
	CONSTRAINT "fk_academic_name_titles_advisors" FOREIGN KEY("academic_name_title_id") REFERENCES "academic_name_titles"("id"),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "students" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"user_login_id"	integer,
	"name_title_id"	integer,
	"first_name"	text,
	"last_name"	text,
	"student_p_id"	text,
	"advisor_id"	integer,
	"on_going"	numeric,
	"completed"	numeric,
	CONSTRAINT "fk_students_user_login" FOREIGN KEY("user_login_id") REFERENCES "user_logins"("id"),
	CONSTRAINT "fk_advisors_students" FOREIGN KEY("advisor_id") REFERENCES "advisors"("id"),
	CONSTRAINT "fk_name_titles_students" FOREIGN KEY("name_title_id") REFERENCES "name_titles"("id"),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "project_statuses" (
	"id"	integer,
	"status"	text,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "academic_years" (
	"year"	integer,
	"max_semester"	integer,
	PRIMARY KEY("year")
);
CREATE TABLE IF NOT EXISTS "academic_year_semesters" (
	"id"	integer,
	"year"	integer,
	"semester"	integer,
	CONSTRAINT "fk_academic_years_academic_year_semesters" FOREIGN KEY("year") REFERENCES "academic_years"("year"),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "projects" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"name"	text,
	"advisor_id"	integer,
	"start_academic_year_semester_id"	integer,
	"grading_academic_year_semester_id"	integer,
	"finish_academic_year_semester_id"	integer,
	"project_status_id"	integer,
	CONSTRAINT "fk_academic_year_semesters_start_projects" FOREIGN KEY("start_academic_year_semester_id") REFERENCES "academic_year_semesters"("id"),
	CONSTRAINT "fk_academic_year_semesters_grading_projects" FOREIGN KEY("grading_academic_year_semester_id") REFERENCES "academic_year_semesters"("id"),
	CONSTRAINT "fk_advisors_projects" FOREIGN KEY("advisor_id") REFERENCES "advisors"("id"),
	CONSTRAINT "fk_academic_year_semesters_finish_projects" FOREIGN KEY("finish_academic_year_semester_id") REFERENCES "academic_year_semesters"("id"),
	CONSTRAINT "fk_project_statuses_projects" FOREIGN KEY("project_status_id") REFERENCES "project_statuses"("id"),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "project_students" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"project_id"	integer,
	"student_id"	integer,
	CONSTRAINT "fk_projects_project_students" FOREIGN KEY("project_id") REFERENCES "projects"("id"),
	CONSTRAINT "fk_students_project_students" FOREIGN KEY("student_id") REFERENCES "students"("id"),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "configs" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"current_academic_year_semester_id"	integer,
	"max_project_meeting_item"	integer,
	CONSTRAINT "fk_academic_year_semesters_configs" FOREIGN KEY("current_academic_year_semester_id") REFERENCES "academic_year_semesters"("id"),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "grades" (
	"id"	integer,
	"grade_value"	text,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "project_meeting_statuses" (
	"id"	integer,
	"status"	text,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "project_meetings" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"project_student_id"	integer,
	"assignment_to_do"	text,
	"assignment_done"	text,
	"assignment_academic_year_semester_id"	integer,
	"project_meeting_status_id"	integer,
	CONSTRAINT "fk_academic_year_semesters_project_meetings" FOREIGN KEY("assignment_academic_year_semester_id") REFERENCES "academic_year_semesters"("id"),
	CONSTRAINT "fk_project_students_project_meetings" FOREIGN KEY("project_student_id") REFERENCES "project_students"("id"),
	CONSTRAINT "fk_project_meeting_statuses_project_meetings" FOREIGN KEY("project_meeting_status_id") REFERENCES "project_meeting_statuses"("id"),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "project_defense_request_statuses" (
	"id"	integer,
	"status"	text,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "project_defense_requests" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"project_student_id"	integer,
	"request_academic_year_semester_id"	integer,
	"part_of_subject"	numeric,
	"part_of_subject_name"	text,
	"project_defense_request_status_id"	integer,
	"project_defense_request_status_accepted"	numeric,
	"project_defense_request_status_message"	text,
	CONSTRAINT "fk_academic_year_semesters_project_defense_requests" FOREIGN KEY("request_academic_year_semester_id") REFERENCES "academic_year_semesters"("id"),
	CONSTRAINT "fk_project_defense_request_statuses_project_defense_requests" FOREIGN KEY("project_defense_request_status_id") REFERENCES "project_defense_request_statuses"("id"),
	CONSTRAINT "fk_project_students_project_defense_requests" FOREIGN KEY("project_student_id") REFERENCES "project_students"("id"),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "project_defense_results" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"project_student_id"	integer,
	"result_academic_year_semester_id"	integer,
	"grade_id"	integer,
	CONSTRAINT "fk_project_students_project_defense_results" FOREIGN KEY("project_student_id") REFERENCES "project_students"("id"),
	CONSTRAINT "fk_grades_project_defense_results" FOREIGN KEY("grade_id") REFERENCES "grades"("id"),
	CONSTRAINT "fk_academic_year_semesters_project_defense_results" FOREIGN KEY("result_academic_year_semester_id") REFERENCES "academic_year_semesters"("id"),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "project_defense_file_storages" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"project_defense_request_id"	integer,
	"file_name"	text,
	"file_data"	text,
	CONSTRAINT "fk_project_defense_requests_project_defense_file_storages" FOREIGN KEY("project_defense_request_id") REFERENCES "project_defense_requests"("id"),
	PRIMARY KEY("id")
);
INSERT INTO "user_login_roles" VALUES (1,'Advisor');
INSERT INTO "user_login_roles" VALUES (2,'Student');
INSERT INTO "admins" VALUES (1,'2022-11-01 17:03:51.8144192+07:00','2022-11-01 17:03:51.8144192+07:00',NULL,'admin','$2a$14$dQCbbna.sxbxl/xwCFCFQuFlHfOWnB2zqiXDo9uxTASDU9sBq9ShS');
INSERT INTO "name_titles" VALUES (1,'');
INSERT INTO "name_titles" VALUES (2,'นาย');
INSERT INTO "name_titles" VALUES (3,'นาง');
INSERT INTO "name_titles" VALUES (4,'นางสาว');
INSERT INTO "name_titles" VALUES (5,'ดร.');
INSERT INTO "academic_name_titles" VALUES (1,'','');
INSERT INTO "academic_name_titles" VALUES (2,'ศาสตราจารย์','ศ.');
INSERT INTO "academic_name_titles" VALUES (3,'รองศาสตราจารย์','รศ.');
INSERT INTO "academic_name_titles" VALUES (4,'ผู้ช่วยศาสตราจารย์','ผศ.');
INSERT INTO "academic_name_titles" VALUES (5,'อาจารย์','อ.');

INSERT INTO "project_statuses" VALUES (1,'กำลังดำเนินการ');
INSERT INTO "project_statuses" VALUES (2,'ผ่าน (S)');
INSERT INTO "project_statuses" VALUES (3,'ไม่ผ่าน (U)');
INSERT INTO "project_statuses" VALUES (4,'การประเมินยังไม่สิ้นสุด (P)');
INSERT INTO "academic_years" VALUES (2561,3);
INSERT INTO "academic_years" VALUES (2562,3);
INSERT INTO "academic_years" VALUES (2563,3);
INSERT INTO "academic_years" VALUES (2564,3);
INSERT INTO "academic_years" VALUES (2565,3);
INSERT INTO "academic_year_semesters" VALUES (1,2561,1);
INSERT INTO "academic_year_semesters" VALUES (2,2561,2);
INSERT INTO "academic_year_semesters" VALUES (3,2561,3);
INSERT INTO "academic_year_semesters" VALUES (4,2562,1);
INSERT INTO "academic_year_semesters" VALUES (5,2562,2);
INSERT INTO "academic_year_semesters" VALUES (6,2562,3);
INSERT INTO "academic_year_semesters" VALUES (7,2563,1);
INSERT INTO "academic_year_semesters" VALUES (8,2563,2);
INSERT INTO "academic_year_semesters" VALUES (9,2563,3);
INSERT INTO "academic_year_semesters" VALUES (10,2564,1);
INSERT INTO "academic_year_semesters" VALUES (11,2564,2);
INSERT INTO "academic_year_semesters" VALUES (12,2564,3);
INSERT INTO "academic_year_semesters" VALUES (13,2565,1);
INSERT INTO "academic_year_semesters" VALUES (14,2565,2);
INSERT INTO "academic_year_semesters" VALUES (15,2565,3);
INSERT INTO "configs" VALUES (1,'2022-11-01 17:03:54.0573397+07:00','2022-11-01 17:03:54.0573397+07:00',NULL,13,4);
INSERT INTO "grades" VALUES (1,'');
INSERT INTO "grades" VALUES (2,'S');
INSERT INTO "grades" VALUES (3,'U');
INSERT INTO "grades" VALUES (4,'P');
INSERT INTO "project_meeting_statuses" VALUES (1,'ตรวจทานเรียบร้อย');
INSERT INTO "project_meeting_statuses" VALUES (2,'ไม่ผ่าน');
INSERT INTO "project_meeting_statuses" VALUES (3,'อยู่ระหว่างการตรวจทาน');
INSERT INTO "project_defense_request_statuses" VALUES (1,'อนุมัติ');
INSERT INTO "project_defense_request_statuses" VALUES (2,'ไม่อนุมัติ');
INSERT INTO "project_defense_request_statuses" VALUES (3,'อยู่ระหว่างการอนุมัติ');
CREATE UNIQUE INDEX IF NOT EXISTS "idx_user_login_roles_role" ON "user_login_roles" (
	"role"
);
CREATE INDEX IF NOT EXISTS "idx_user_logins_deleted_at" ON "user_logins" (
	"deleted_at"
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_admins_username" ON "admins" (
	"username"
);
CREATE INDEX IF NOT EXISTS "idx_admins_deleted_at" ON "admins" (
	"deleted_at"
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_name_titles_title" ON "name_titles" (
	"title"
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_academic_name_titles_title" ON "academic_name_titles" (
	"title"
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_advisors_email" ON "advisors" (
	"email"
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_advisors_advisor_p_id" ON "advisors" (
	"advisor_p_id"
);
CREATE INDEX IF NOT EXISTS "idx_advisors_deleted_at" ON "advisors" (
	"deleted_at"
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_students_student_p_id" ON "students" (
	"student_p_id"
);
CREATE INDEX IF NOT EXISTS "idx_students_deleted_at" ON "students" (
	"deleted_at"
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_project_statuses_status" ON "project_statuses" (
	"status"
);
CREATE INDEX IF NOT EXISTS "idx_projects_deleted_at" ON "projects" (
	"deleted_at"
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_project_student_fk" ON "project_students" (
	"project_id",
	"student_id"
);
CREATE INDEX IF NOT EXISTS "idx_project_students_deleted_at" ON "project_students" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_configs_deleted_at" ON "configs" (
	"deleted_at"
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_grades_grade_value" ON "grades" (
	"grade_value"
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_project_meeting_statuses_status" ON "project_meeting_statuses" (
	"status"
);
CREATE INDEX IF NOT EXISTS "idx_project_meetings_deleted_at" ON "project_meetings" (
	"deleted_at"
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_project_defense_request_statuses_status" ON "project_defense_request_statuses" (
	"status"
);
CREATE INDEX IF NOT EXISTS "idx_project_defense_requests_deleted_at" ON "project_defense_requests" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_project_defense_results_deleted_at" ON "project_defense_results" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_project_defense_file_storages_deleted_at" ON "project_defense_file_storages" (
	"deleted_at"
);
COMMIT;

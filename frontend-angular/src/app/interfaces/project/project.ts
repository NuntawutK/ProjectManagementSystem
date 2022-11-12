import { AcademicYearSemester } from "./academic-year-semester";
import { Advisor } from "../user/advisor";
import { Student } from "../user/student";
import { ProjectMeeting } from "./project-meeting";
import { ProjectDefenseRequest } from "./project-defense";
import { ProjectDefenseResult } from "./project-result";

export interface Project {
  id: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  
  name: string;

  students: Student[];
  projectStudents: ProjectStudent[];

  advisorId: number;
  advisor: Advisor;

  startAcademicYearSemesterId: number | null;
  startAcademicYearSemester: AcademicYearSemester | null;

  gradingAcademicYearSemesterId: number | null;
  gradingAcademicYearSemester: AcademicYearSemester | null;

  finishAcademicYearSemesterId: number | null;
  finishAcademicYearSemester: AcademicYearSemester | null;

  projectStatusId: number;
  projectStatus: ProjectStatus;
}

export interface ProjectStatus {
  id: number;
  status: string;
}

export interface ProjectStudent {
  id: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  projectId: number;
  project: Project;

  studentId: number;
  student: Student;

  projectDefenseRequests: ProjectDefenseRequest[];
  
  projectMeetings: ProjectMeeting[];

  projectDefenseResults: ProjectDefenseResult[];
}
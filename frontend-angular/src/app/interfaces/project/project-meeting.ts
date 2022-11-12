import { AcademicYearSemester } from "./academic-year-semester";
import { ProjectStudent } from "./project";

export interface ProjectMeeting {
  id: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  projectStudentId: number;
  projectStudent: ProjectStudent;
  assignmentToDo: string;
  assignmentDone: string;
  assignmentAcademicYearSemesterId: number;
  assignmentAcademicYearSemester: AcademicYearSemester;
  projectMeetingStatusId: number;
  projectMeetingStatus: ProjectMeetingStatus;
}

export interface ProjectMeetingStatus {
  id: number;
  status: string;
}
import { AcademicYearSemester } from "./academic-year-semester";
import { ProjectStudent } from "./project";

export interface ProjectDefenseResult {
  id: number;

  projectStudentId: number;
  projectStudent: ProjectStudent;

  resultAcademicYearSemesterId: number;
  resultAcademicYearSemester: AcademicYearSemester;

  gradeId: number;
  grade: Grade;
}

export interface Grade {
  id: number;
  gradeValue: string;
}
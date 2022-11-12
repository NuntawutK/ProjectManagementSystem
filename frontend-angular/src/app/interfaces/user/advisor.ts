import { Project } from "../project/project";
import { AcademicNameTitle } from "./academic-name-title";
import { NameTitle } from "./name-title";
import { Student } from "./student";

export interface Advisor {
  id: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  academicNameTitleId: number;
  academicNameTitle: AcademicNameTitle;

  nameTitleId: number;
  nameTitle: NameTitle;

  firstName: string;
  lastName: string;
  email: string;
  advisorPid: string;

  students: Student[];
  
  projects: Project[];
}
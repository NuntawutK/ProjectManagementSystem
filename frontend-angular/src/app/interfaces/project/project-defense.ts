import { AcademicYearSemester } from "./academic-year-semester";
import { ProjectStudent } from "./project";

export interface ProjectDefenseRequest {
  id: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  projectStudentId: number;
  projectStudent: ProjectStudent;

  requestAcademicYearSemesterId: number;
  requestAcademicYearSemester: AcademicYearSemester;

  partOfSubject: boolean;
  partOfSubjectName: string;

  projectDefenseRequestStatusId: number;
  projectDefenseRequestStatus: ProjectDefenseRequestStatus;
  projectDefenseRequestStatusMessage: string;
  projectDefenseRequestStatusAccepted: boolean;

  projectDefenseFileStorages: ProjectDefenseFileStorage[];
}

export interface ProjectDefenseRequestStatus {
  id: number;
  status: string;
}

export interface ProjectDefenseFileStorage {
  id: number;

  projectDefenseRequestId: number;
  projectDefenseRequest: ProjectDefenseRequest;

  fileName: string;
  fileData: string;
}
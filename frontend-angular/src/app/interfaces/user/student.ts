import { NameTitle } from "./name-title";
import { Advisor } from "./advisor";
import { Project } from "../project/project";
import { UserLogin } from "../user-login/user-login.model";

export interface Student {
  id: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  userLoginId: number;
  userLogin: UserLogin;
  nameTitleId: number;
  nameTitle: NameTitle;
  firstName: string;
  lastName: string;
  studentPid: string;
  advisorId: number;
  advisor: Advisor;
  onGoing: boolean;
  completed: boolean;
  projects: Project[];
}
export interface UserLogin {
  id: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  userPid: string;
  password: string;
  userLoginRoleId: number;
  userLoginRole: UserLoginRole;
}

export interface UserLoginRole {
  id: number;
  role: string;
}
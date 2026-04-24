import { Department, UserRole } from ".";

// export interface User {
//   codUser: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   role: UserRole;   
//   departments: string[]; // Array si puede estar en varios
//   isActive: boolean;
// }

export interface UserCreateDto {
  codUser: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  departmentIds: number[]; // Array si puede estar en varios
  password: string; 
  country: string;  
  phone: string;
}

export interface UserDetail{
  codUser: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  country: string;
  phone: string;
  isActive: boolean;
  userDepartments: UserDepartment[]; // Array si puede estar en varios
}

export interface UserProfile extends UserDetail {
  sessions:UserSession[];
}

export interface UserSession {
  id: string;
  userId: number;
  deviceInfo: string;
  ipAddress: string;
  lastActive: Date;
  expiresAt: Date;}

export interface UserDepartment {
  id: number;
  assignedAt: Date;
  department: Department;
}
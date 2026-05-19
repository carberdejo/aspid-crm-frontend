import { Department, GenericFilters, UserRole } from ".";

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

export interface UserDetail {
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
  sessions: UserSession[];
}

// Interfaz User
export interface User {
  id: number;
  codUser: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  departments: string[];
  isActive: boolean;
  phone: string;
  countryCode: string;
}

export interface UserSession {
  id: string;
  userId: number;
  deviceInfo: string;
  ipAddress: string;
  lastActive: Date;
  expiresAt: Date;
}

export interface UserDepartment {
  id: number;
  assignedAt: Date;
  department: Department;
}

export interface UserFilters extends GenericFilters {
  term?: string;
  isActive?: boolean;
  departmentId?: number;
  role?: string;
}

import { UserRole } from './role-user.interface';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
export interface ApiErrorResponse {
  code: number;
  message: string;
  errors: string[] | null;
}

export interface ResponseCreate{
  message: string;
}

// Paginación response
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

// Interfaz User
export interface User {
  codUser: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  departments: string[];
  isActive: boolean;
}

export interface Payload {
  sub: number; // ID del usuario
  codUser: string;
  email: string;
  role: UserRole;
  depts: number[]; // Array de áreas
  exp?: number; // Expiration time del JWT
  iat?: number; // Issued at time del JWT
}

export interface RefreshTokenRequest {
  refreshToken: string;
}


export interface RefreshTokenResponse {
  accessToken: string;
}

export interface RefeshPayload{
  sub: string;
  sessionId: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface GenericFilters {
  limit?: number;
  offset?: number;
  startDate?: Date;
  endDate?: Date;
  // Permite otros filtros dinámicos
}

export interface Logout{
  sessionId: string;
  allDevices?: boolean; // Si true, cierra todas las sesiones excepto la actual
}
export interface Department{
    id: number;
    name: string;
    isActive: boolean;
}

/** Usuario activo de un área, para los selectores de responsable y colaborador */
export interface DepartmentMember {
  id: number;
  codUser: string;
  fullName: string;
}

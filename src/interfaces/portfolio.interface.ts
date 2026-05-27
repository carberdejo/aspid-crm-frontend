import { GenericFilters } from ".";

export interface PortfolioUser {
  id: string;
  roleInPortfolio: RoleInPortfolio;
  user: {
    id: string;
    codUser: string;
    firstName: string;
    lastName: string;
  };
}

export interface Portfolio {
  id: string;
  code: string;
  type: string;
  province: string;
  zone: string;
  isActive?: boolean;
  users?: PortfolioUser[];
}

export interface PortfolioCreateDto {
  code: string;
  type: string;
  province?: string;
  zone?: string;
  users?: { userId: number; roleInPortfolio: string }[];
}

export enum RoleInPortfolio {
  ASESOR = "ASESOR",
  ING_PROYECTOS = "ING_PROYECTOS",
  SERVICIOS = "SERVICIOS",
}
// export interface PortfolioUpdate extends Partial<Portfolio> {
//   users: PortfolioUser[];
// }

export interface PortfolioUpdateDto extends Partial<PortfolioCreateDto> {
  id?: string;
  isActive?: boolean;
}

export interface PortfolioQuery extends GenericFilters {
  term?: string;
}

// ENUMS CREADOS PARA SELECTS
export enum PortfolioType {
  INDUSTRIAL = "INDUSTRIAL",
  DIDACTICA = "DIDACTICA",
  DISTRIBUIDOR = "DISTRIBUIDOR",
}

export enum PortfolioZone {
  NORTE = "NORTE",
  SUR = "SUR",
  CENTRO = "CENTRO",
  ESTE = "ESTE",
  OESTE = "OESTE",
  CALLAO = "CALLAO",
}

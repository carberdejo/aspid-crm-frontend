import { GenericFilters } from ".";

export interface VisitItem {
  id: string;
  userId: number;
  clientId: number;
  contactId: number;
  departmentId: number;
  date: Date;
  visitTopics: string;
  outcomeSummary: string;
  user: UserItemOperation;
  client: ClientItemOperation;
  contact: ContactItemOperation;
}
export interface VisitCreateDto {
  userId: number;
  clientId: number;
  contactId: number;
  departmentId: number;
  date: Date;
  visitTopics: string;
  outcomeSummary: string;
}

export interface VisitListItem {
  id: number;
  userId: number;
  clientId: number;
  contactId: number;
  departmentId: number;
  date: Date;
  visitTopics: string;
  outcomeSummary: string;
  user: UserListItemOperation;
  client: ClientListItemOperation;
  contact: ContactListItemOperation;
}

export interface ClientListItemOperation {
  id: number;
  commercialName: string;
  ruc: string;
}
export interface ClientItemOperation {
  id: number;
  commercialName: string;
  businessName: string;
  ruc: string;
  address: string;
}
export interface UserListItemOperation {
  id: number;
  codUser: string;
  firstName: string;
  lastName: string;
}
export interface UserItemOperation {
  id: number;
  codUser: string;
  firstName: string;
  lastName: string;
  email: string;
}
export interface ContactListItemOperation {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
}
export interface ContactItemOperation {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
}

export interface VisitFilter extends GenericFilters, Record<string, unknown> {
  departmentId?: number;
  clientId?: number;
  userId?: number;
  term?: string;
}

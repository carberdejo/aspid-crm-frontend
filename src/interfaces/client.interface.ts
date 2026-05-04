import { GenericFilters } from ".";

export interface ClientListItem {
  id: string;
  commercialName: string;
  businessName: string;
  ruc: string;
  address: string;
  createdAt: string;
  contacts: number;
}

export interface ClientItem {
  id: string;
  commercialName: string;
  businessName: string;
  ruc: string;
  address: string;
  createdAt: Date;
  contacts: Contact[];
}

export interface ClientCreateDto {
  commercialName: string;
  businessName: string;
  ruc: string;
  address: string;
}

export interface ClientFilters extends GenericFilters {
  term?: string;
}

export interface ResponseRuc {
  ruc: string;
  razonSocial: string;
  direccion: string;
}

export interface ClientAndContactResponseCreate<T> {
  message: string;
  item: T;
}

export interface ClienteCreateResponseItem {
  id: string;
  commercialName: string;
  businessName: string;
  ruc: string;
  address: string;
  createdAt: Date;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  clientId: string;
}

export interface ContactCreateDto {
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  clientId: number;
}

export interface ClientDetail {
  id: string;
  commercialName: string;
  businessName: string;
  ruc: string;
  address: string;
  createdAt: Date;
  contacts: Contact[];
}

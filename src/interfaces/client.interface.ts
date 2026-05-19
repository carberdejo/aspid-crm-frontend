import { GenericFilters } from ".";

export interface ClientListItem {
  id: string;
  commercialName: string;
  businessName: string;
  ruc: string;
  address: string;
  createdAt: string;
  contacts: number;
  segmentId: number;
  portfolioId: number;
  segment?: IndustrySegment;
  portfolio?: Portfolio;
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
  segmentId: number;
  portfolioId: number;
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
  countryCode: string;
  clientId: string;
  email: string;
}

export interface ContactCreateDto {
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  clientId: number;
  email: string;
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

export interface IndustrySegment {
  id: string;
  code: string;
  name: string;
}

export interface Portfolio {
  id: string;
  code: string;
  type: string;
  zone: string;
}

export interface UpdateClientInput extends Partial<ClientCreateDto> {
  id: string;
}

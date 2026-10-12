export interface Delivery {
  id: string;
  departmentId: string | null; // NULL solo en entregas antiguas
  client: ClientDeliveryList;
  user: UserDeliveryList;
  deliveryDate: string;
  deliveryItems: DeliveryItem[];
}

export interface ClientDeliveryList {
  id: string;
  businessName: string;
  ruc: string;
}

export interface DeliveryItem {
  cantidad: number;
  producto: string;
}

export interface UserDeliveryList {
  id: string;
  firstName: string;
  lastName: string;
}

export interface DeliveryCreateDto {
  clientId: number;
  userId: number;
  departmentId: number; // Área en la que se registra la entrega
  deliveryDate: string; //
  deliveryItems: DeliveryItem[];
}

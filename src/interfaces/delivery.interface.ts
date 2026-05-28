export interface Delivery {
  id: string;
  client: ClientDeliveryList;
  user: UserDeliveryList;
  deliveryDate: Date;
  deliveryItems: DeliveryItem[];
}

export interface ClientDeliveryList {
  id: string;
  businessName: string;
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
  deliveryDate: string; //
  deliveryItems: DeliveryItem[];
}

export interface Offer {
  id: string;
  supplierId: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  description?: string;
  createdAt: Date;
}

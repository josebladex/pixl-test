export interface Event {
  price: number;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  date: Date;
  image?: string;
  createdById: number;
}
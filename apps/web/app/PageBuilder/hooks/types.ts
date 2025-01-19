export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export interface Editor {
  id: string;
  name: string;
  state: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

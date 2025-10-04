export interface Medication {
  id: string;
  name: string;
  weight: number;
  code: string;
  image: string;
  droneId?: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}

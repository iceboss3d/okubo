export interface JwtPayload {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  created_at: Date;
  updated_at: Date;
}

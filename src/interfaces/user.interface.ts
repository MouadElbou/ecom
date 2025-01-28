export interface User {
  id: string;
  email: string;
  role: 'CLIENT' | 'SUPPLIER';
  name: string;
}

// features/users/types.ts

// Interface qui définit la structure d'un utilisateur
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
}

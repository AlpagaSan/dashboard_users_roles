// features/users/userService.ts
import type { User } from './types';

// Données mockées pour simuler une réponse d'API
const mockUsers: User[] = [
  { id: 1, name: 'Alice Dupont', email: 'alice@exemple.com', role: 'admin' },
  { id: 2, name: 'Bob Martin', email: 'bob@exemple.com', role: 'viewer' },
  { id: 3, name: 'Carole Dubois', email: 'carole@exemple.com', role: 'manager' },
];

// Simule un appel API qui retourne une promesse avec les utilisateurs
export function getUsers(): Promise<User[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockUsers), 500); // délai pour simuler un appel réseau
  });
}

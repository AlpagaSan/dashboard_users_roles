// features/users/userService.ts
import type { User } from './types';

// Données mockées pour simuler une réponse d'API
let mockUsers: User[] = [
  { id: 1, name: 'Alice Dupont', email: 'alice@exemple.com', role: 'admin' },
  { id: 2, name: 'Bob Martin', email: 'bob@exemple.com', role: 'viewer' },
  { id: 3, name: 'Carole Dubois', email: 'carole@exemple.com', role: 'manager' },
];

// Utilitaire simulant un appel réseau
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Simule un appel API qui retourne une promesse avec les utilisateurs
export async function getUsers(): Promise<User[]> {
  await delay(300);
  return [...mockUsers]; // retourne une copie
}

// Ajouter un utilisateur
export async function addUser(user: User): Promise<User> {
  await delay(300);
  mockUsers.push(user);
  return user;
}

// Mettre à jour un utilisateur
export async function updateUser(updatedUser: User): Promise<User | null> {
  await delay(300);
  mockUsers = mockUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u));
  return updatedUser;
}

export async function deleteUser(userId: number): Promise<boolean> {
  await delay(300);
  mockUsers = mockUsers.filter((u) => u.id !== userId);
  return true;
}
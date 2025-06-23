// features/users/userService.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { getUsers, addUser, updateUser, deleteUser } from './userService';
import type { User } from './types';

// ⚠️ Important : ces tests partagent l'état mockUsers entre eux !

const baseUsers: User[] = [
  { id: 1, name: 'Alice Dupont', email: 'alice@exemple.com', role: 'admin' },
  { id: 2, name: 'Bob Martin', email: 'bob@exemple.com', role: 'viewer' },
  { id: 3, name: 'Carole Dubois', email: 'carole@exemple.com', role: 'manager' },
];

// Réinitialisation manuelle : recharger les données initiales à chaque test
beforeEach(async () => {
  for (const user of await getUsers()) {
    await deleteUser(user.id);
  }
  for (const user of baseUsers) {
    await addUser(user);
  }
});

describe('userService', () => {
  it('getUsers retourne tous les utilisateurs', async () => {
    const users = await getUsers();
    expect(users.length).toBe(3);
  });

  it('addUser ajoute un nouvel utilisateur', async () => {
    const newUser: User = { id: 4, name: 'David Test', email: 'david@test.com', role: 'viewer' };
    await addUser(newUser);
    const users = await getUsers();
    expect(users.length).toBe(4);
    expect(users.find(u => u.id === 4)?.name).toBe('David Test');
  });

  it('updateUser modifie les données', async () => {
    const updated: User = { id: 1, name: 'Alice Modifiée', email: 'alice@modif.com', role: 'manager' };
    await updateUser(updated);
    const users = await getUsers();
    const u = users.find(u => u.id === 1);
    expect(u).toBeDefined();
    expect(u?.name).toBe('Alice Modifiée');
  });

  it('deleteUser supprime un utilisateur', async () => {
    await deleteUser(2);
    const users = await getUsers();
    expect(users.length).toBe(2);
    expect(users.find(u => u.id === 2)).toBeUndefined();
  });

    // 🔍 Cas limites et erreurs silencieuses attendues

  it('updateUser avec ID inexistant ne modifie rien', async () => {
    const updated: User = { id: 999, name: 'Ghost', email: 'ghost@none.com', role: 'admin' };
    await updateUser(updated);
    const users = await getUsers();
    expect(users.length).toBe(3);
    expect(users.find(u => u.id === 999)).toBeUndefined();
  });

  it('deleteUser avec ID inexistant ne casse rien', async () => {
    await deleteUser(999);
    const users = await getUsers();
    expect(users.length).toBe(3);
  });

  it('addUser avec email vide fonctionne (validation non faite ici)', async () => {
    const newUser: User = { id: 5, name: 'Vide Email', email: '', role: 'admin' };
    await addUser(newUser);
    const users = await getUsers();
    expect(users.find(u => u.id === 5)).toBeDefined();
  });

  /*it('addUser avec ID existant écrase sans erreur', async () => {
    const overwritten: User = { id: 1, name: 'Duplicate', email: 'dup@ex.com', role: 'viewer' };
    await addUser(overwritten);
    const users = await getUsers();
    const user = users.find(u => u.id === 1);
    expect(user?.name).toBe('Duplicate'); // Pas idéal sans validation
  });
  */

});

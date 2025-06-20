// features/users/UserList.tsx
import { useEffect, useState } from 'react';
import { getUsers } from './userService';
import type { User } from './types';

// Composant qui affiche la liste des utilisateurs
export function UserList() {
  const [users, setUsers] = useState<User[]>([]); // État local pour stocker la liste
  const [loading, setLoading] = useState(true);   // État de chargement
  const [error, setError] = useState<string | null>(null); // État d'erreur éventuelle

  useEffect(() => {
    // Simule une requête API pour récupérer les utilisateurs
    getUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: 'red' }}>Erreur : {error}</p>;

  return (
    <div>
      <h2>Liste des utilisateurs</h2>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

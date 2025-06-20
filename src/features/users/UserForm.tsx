// features/users/UserForm.tsx
import { useState } from 'react';
import type { User } from './types';

// Props attendues : callback pour ajouter un utilisateur
interface UserFormProps {
  onAdd: (user: User) => void;
  nextId: number; // utilisé pour générer l'ID du nouvel utilisateur
}

// Formulaire contrôlé pour créer un utilisateur
export function UserForm({ onAdd, nextId }: UserFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'manager' | 'viewer'>('viewer');

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation simple
    if (!name || !email) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    const newUser: User = {
      id: nextId,
      name,
      email,
      role,
    };

    onAdd(newUser); // Ajoute le nouvel utilisateur à la liste

    // Réinitialise le formulaire
    setName('');
    setEmail('');
    setRole('viewer');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h3>Ajouter un utilisateur</h3>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value as User['role'])}>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="viewer">Viewer</option>
        </select>
        <button type="submit">Ajouter</button>
      </div>
    </form>
  );
}

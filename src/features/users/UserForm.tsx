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

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation simple
    if (!name.trim()) {
      setError('Le nom est requis.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Email invalide.');
      return;
    }
    if (!['admin', 'manager', 'viewer'].includes(role)) {
      setError('Rôle invalide.');
      return;
    }

    
    setLoading(true);
    setError(null);

    // Simule un délai avant l'ajout (comme un appel API)
    setTimeout(() => {
      const newUser: User = { id: nextId, name, email, role };
      onAdd(newUser);
      setName('');
      setEmail('');
      setRole('viewer');
      setLoading(false);
    }, 300);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      data-testid="user-form"
      style={{ marginBottom: 20 }}
    >
      <h3>Ajouter un utilisateur</h3>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <select value={role} onChange={(e) => setRole(e.target.value as User['role'])} disabled={loading}>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="viewer">Viewer</option>
        </select>
        <button type="submit" disabled={loading}>{loading ? 'Ajout...' : 'Ajouter'}</button>
        {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
      </div>
    </form>
  );
}

// Entrée du projet - App.tsx
import { useState } from 'react';
import { UserList } from './features/users/UserList';
import { RoleList } from './features/roles/RoleList';
import './App.css'; // Importation du fichier CSS pour le style

export default function App() {
  const [section, setSection] = useState<'users' | 'roles'>('users');

  return (
    <div style={{ padding: 20 }}>
      <header>
        <button onClick={() => setSection('users')}>Gestion des utilisateurs</button>
        <button onClick={() => setSection('roles')}>Gestion des rôles</button>
      </header>

      <main style={{ marginTop: 20 }}>
        {section === 'users' ? <UserList /> : <RoleList />}
      </main>
    </div>
  );
}

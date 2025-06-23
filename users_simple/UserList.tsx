// features/users/UserList.tsx
import { useEffect, useState } from 'react';
import { UserForm } from './UserForm';
import { getUsers } from './userService';
import type { User, UserFields } from './types';

// Composant qui affiche la liste des utilisateurs
export function UserList() {
  const [users, setUsers] = useState<User[]>([]); // État complet et local pour stocker la liste
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // État filtré à afficher
  const [loading, setLoading] = useState(true);   // État de chargement
  const [error, setError] = useState<string | null>(null); // État d'erreur éventuelle

  // État pour la recherche dynamique
  // Permet de filtrer les utilisateurs par nom ou email
  const [search, setSearch] = useState('');

  const [page, setPage] = useState(1);
  const pageSize = 5;

  // État pour gérer l'édition d'un utilisateur
  // editUserId stocke l'ID de l'utilisateur en cours d'édition
  const [editUserId, setEditUserId] = useState<number | null>(null);

  // editForm stocke les champs de l'utilisateur en cours d'édition
  // Il est initialisé à null pour indiquer qu'aucun utilisateur n'est en cours d'édition
  // Lorsqu'un utilisateur est sélectionné pour l'édition, il est rempli avec les données de l'utilisateur
  // Cela permet de pré-remplir le formulaire d'édition avec les données existantes
  const [editForm, setEditForm] = useState<UserFields | null>(null);

  const [actionLoading, setActionLoading] = useState(false); // Pour les actions individuelles
  const [formError, setFormError] = useState<string | null>(null); // Erreur de validation
  
  // Effet pour charger les utilisateurs au démarrage du composant
  // Utilise getUsers pour simuler une requête API
  // Met à jour l'état users avec les données récupérées
  useEffect(() => {
    // Simule une requête API pour récupérer les utilisateurs
    getUsers()
      .then((data) => {
        // Met à jour l'état users avec les données récupérées
        // setUsers met à jour la liste complète des utilisateurs
        setUsers(data);
        // setFilteredUsers met à jour la liste filtrée à afficher
        // Au démarrage, on affiche tous les utilisateurs
        setFilteredUsers(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Effet pour filtrer les utilisateurs en fonction de la recherche
  // Utilise l'état search pour filtrer les utilisateurs par nom ou email
  useEffect(() => {
    // Filtrage dynamique en fonction du nom ou de l'email
    const lower = search.toLowerCase();
    // setFilteredUsers met à jour la liste filtrée en fonction de la recherche
    // On utilise filter pour créer une nouvelle liste d'utilisateurs qui correspondent à la recherche
    setFilteredUsers(
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(lower) ||
          u.email.toLowerCase().includes(lower)
      )
    );
    setPage(1);
  }, [search, users]);

  // Callback pour ajouter un nouvel utilisateur
  const handleAddUser = (newUser: User) => {
    // prev représente la liste actuelle des utilisateurs au moment précis de l'appel.
    // On retourne une nouvelle liste avec le nouvel utilisateur ajouté à la fin.
    setUsers(prev => [...prev, newUser]);
  };

  // Callback pour modifier un nouvel utilisateur
  const handleEditUser = (user: User) => {
    // Lorsqu'on clique sur "Modifier", on remplit le formulaire d'édition avec les données de l'utilisateur
    // On utilise setEditUserId pour stocker l'ID de l'utilisateur en cours d'édition
    // Cela permet de savoir quel utilisateur est en cours d'édition
    setEditUserId(user.id);
    // On remplit le formulaire d'édition avec les données de l'utilisateur
    // Cela permet de pré-remplir les champs du formulaire avec les données existantes  
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  // Gère les changements dans le formulaire d'édition
  // field est le nom du champ à modifier (name, email, role)
  const handleEditChange = (field: keyof UserFields, value: string) => {
    if (editForm) {
      // Met à jour le formulaire d'édition avec la nouvelle valeur pour le champ spécifié
      // On utilise la syntaxe de décomposition pour mettre à jour uniquement le champ modifié
      setEditForm({ ...editForm, [field]: value });
    }
  };

  // Callback pour enregistrer les modifications d'un utilisateur
  // userId est l'ID de l'utilisateur en cours d'édition
  const handleEditSave = (userId: number) => {
    // Vérifie que le formulaire d'édition n'est pas vide
    if (!editForm) return;

    // Validation simple côté client
    if (!editForm.name.trim()) {
      setFormError('Le nom est requis.');
      return;
    }
    if (!editForm.email.trim() || !editForm.email.includes('@')) {
      setFormError("Email invalide.");
      return;
    }
    if (!['admin', 'manager', 'viewer'].includes(editForm.role)) {
      setFormError("Rôle invalide.");
      return;
    }

    setActionLoading(true);
    setTimeout(() => {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...editForm } : u))
      );
      setEditUserId(null);
      setEditForm(null);
      setActionLoading(false);
    }, 300);
  };

  // Callback pour annuler l'édition d'un utilisateur
  // Réinitialise l'ID d'édition et le formulaire
  const handleEditCancel = () => {
    // Réinitialise l'ID d'édition pour sortir du mode édition
    setEditUserId(null);
    // Réinitialise le formulaire d'édition pour vider les champs
    setEditForm(null);
    // Réinitialise l'erreur de formulaire
    setFormError(null);  
  };

  // Callback pour supprimer un nouvel utilisateur
  const handleDeleteUser = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    if (!confirm(`Supprimer l'utilisateur "${user.name}" ?`)) return;

    setActionLoading(true);
    setTimeout(() => {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setActionLoading(false);
    }, 300);
  };

  // Affiche un message de chargement ou d'erreur si nécessaire
  if (loading) return <p>Chargement...</p>;
  // Si une erreur est survenue, on l'affiche
  if (error) return <p style={{ color: 'red' }}>Erreur : {error}</p>;

  // Calcule l'ID suivant en prenant le max actuel + 1
  const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

  // Pagination - découpage des utilisateurs filtrés
  const start = (page - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(start, start + pageSize);
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  return (
    <div>
      <h2>Liste des utilisateurs</h2>
      
      <UserForm nextId={nextId} onAdd={handleAddUser} />

      {/* Champ de recherche dynamique */}
      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="Recherche par nom ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id}>
              {editUserId === user.id ? (
                <>
                  <td>
                    <input
                      value={editForm?.name || ''}
                      onChange={(e) => handleEditChange('name', e.target.value)}
                      disabled={actionLoading}
                    />
                  </td>
                  <td>
                    <input
                      value={editForm?.email || ''}
                      onChange={(e) => handleEditChange('email', e.target.value)}
                      disabled={actionLoading}
                    />
                  </td>
                  <td>
                    <select
                      value={editForm?.role || 'viewer'}
                      onChange={(e) => handleEditChange('role', e.target.value)}
                      disabled={actionLoading}
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleEditSave(user.id)} disabled={actionLoading}>
                      {actionLoading ? '...' : 'Enregistrer'}
                    </button>
                    <button onClick={handleEditCancel} disabled={actionLoading}>Annuler</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleEditUser(user)} disabled={actionLoading}>Modifier</button>
                    <button onClick={() => handleDeleteUser(user.id)} disabled={actionLoading}>Supprimer</button>
                    {formError && <div style={{ color: 'red', marginTop: 4 }}>{formError}</div>}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: 10 }}>
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          Précédent
        </button>
        <span style={{ margin: '0 10px' }}>Page {page} / {totalPages}</span>
        <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
          Suivant
        </button>
      </div>

    </div>
  );
}

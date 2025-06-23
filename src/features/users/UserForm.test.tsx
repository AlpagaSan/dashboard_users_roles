// features/users/UserForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { UserForm } from './UserForm';
import type { User } from './types';

describe('UserForm', () => {
  it('désactive le bouton et affiche une erreur si les champs sont invalides', async () => {
    render(<UserForm onAdd={vi.fn()} nextId={99} />);

    const form = screen.getByTestId('user-form');
    const submit = within(form).getByRole('button', { name: /ajouter/i });

    fireEvent.click(submit);

    await waitFor(() => {
      expect(screen.getByText(/le nom est requis/i)).toBeDefined();
    });
  });

  it('appelle onAdd avec les bonnes données si tout est valide', async () => {
    const handleAdd = vi.fn();

    render(<UserForm onAdd={handleAdd} nextId={99} />);

    //const form = screen.getByTestId('user-form');
    const forms = screen.getAllByTestId('user-form');
    const form = forms[1]; // ou le bon index si besoin

    fireEvent.change(within(form).getByPlaceholderText(/nom/i), {
        target: { value: 'Test Nom' },
    });
    fireEvent.change(within(form).getByPlaceholderText(/email/i), {
        target: { value: 'test@mail.com' },
    });
    fireEvent.change(within(form).getByRole('combobox'), {
        target: { value: 'admin' },
    });
    fireEvent.click(within(form).getByRole('button', { name: /ajouter/i }));

    await waitFor(() => {
      expect(handleAdd).toHaveBeenCalledWith({
        id: 99,
        name: 'Test Nom',
        email: 'test@mail.com',
        role: 'admin',
      });
    });
  });
});

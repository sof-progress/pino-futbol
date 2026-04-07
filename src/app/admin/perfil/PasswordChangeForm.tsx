'use client';

import { useState } from 'react';
import { cambiarPassword } from '../actions/perfil';
import { FormMessage } from '@/components/ui/FormMessage';

export default function PasswordChangeForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    
    // Client-side validation
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'La nueva contraseña y la confirmación no coinciden' });
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 8 caracteres' });
      setLoading(false);
      return;
    }

    try {
      const result = await cambiarPassword(formData);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message! });
        (e.target as HTMLFormElement).reset();
      } else {
        setMessage({ type: 'error', text: result.error || 'Error desconocido' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ocurrió un error inesperado al cambiar la contraseña' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <FormMessage type={message.type} message={message.text} />
      )}

      <div>
        <label className="block text-sm font-medium text-brand-secondary mb-1">
          Contraseña Actual
        </label>
        <input
          type="password"
          name="currentPassword"
          required
          className="w-full bg-background border border-surface-border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-secondary mb-1">
          Nueva Contraseña
        </label>
        <input
          type="password"
          name="newPassword"
          required
          minLength={8}
          className="w-full bg-background border border-surface-border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
        />
        <p className="text-xs text-brand-secondary mt-1">Mínimo 8 caracteres</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-secondary mb-1">
          Confirmar Nueva Contraseña
        </label>
        <input
          type="password"
          name="confirmPassword"
          required
          minLength={8}
          className="w-full bg-background border border-surface-border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
        />
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-[var(--brand-primary)] text-black font-bold rounded-xl hover:bg-[var(--brand-primary)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
        </button>
      </div>
    </form>
  );
}

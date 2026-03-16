'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { crearCancha, actualizarCancha } from '../../actions/canchas';
import { FormMessage } from '../../components/FormMessage';
import Link from 'next/link';

interface CanchaFormProps {
  cancha?: {
    id: string;
    name: string;
    description: string | null;
    address: string | null;
    imageUrl: string | null;
    mapsUrl: string | null;
  };
}

export function CanchaForm({ cancha }: CanchaFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isEditing = !!cancha;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      setMessage(null);
      
      const result = isEditing
        ? await actualizarCancha(cancha.id, formData)
        : await crearCancha(formData);

      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else if (result.success) {
        setMessage({ type: 'success', text: result.success });
        if (!isEditing) {
          (e.target as HTMLFormElement).reset();
          router.push('/admin/canchas');
        } else {
          router.push('/admin/canchas');
        }
      }
    });
  };

  return (
    <div className="bg-[#0d0d0d] border border-zinc-800 rounded-2xl p-6 lg:p-8 max-w-2xl">
      <h2 className="text-xl font-bold text-white mb-6">
        {isEditing ? 'Editar Cancha' : 'Nueva Cancha'}
      </h2>

      {message && <FormMessage type={message.type} message={message.text} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-zinc-400 mb-2">
            Nombre de la cancha *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            required
            defaultValue={cancha?.name || ''}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14] transition-all"
            placeholder="Ej: El Pino, Nora Vera, etc."
          />
        </div>

        <div>
          <label htmlFor="direccion" className="block text-sm font-medium text-zinc-400 mb-2">
            Dirección
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            defaultValue={cancha?.address || ''}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14] transition-all"
            placeholder="Ej: Calle 13 y 32, Barrio San Benito"
          />
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-zinc-400 mb-2">
            Descripción o Detalles
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={3}
            defaultValue={cancha?.description || ''}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14] transition-all resize-none"
            placeholder="Detalles sobre el terreno (césped sintético, tierra, vestuarios, etc.)"
          />
        </div>

        <div>
          <label htmlFor="mapsUrl" className="block text-sm font-medium text-zinc-400 mb-2">
            URL de Google Maps
          </label>
          <input
            type="url"
            id="mapsUrl"
            name="mapsUrl"
            defaultValue={cancha?.mapsUrl || ''}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14] transition-all"
            placeholder="https://goo.gl/maps/..."
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-zinc-400 mb-2">
            URL de Foto de la cancha
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            defaultValue={cancha?.imageUrl || ''}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14] transition-all"
            placeholder="https://ejemplo.com/foto.jpg"
          />
        </div>

        <div className="pt-4 flex items-center gap-4">
          <Link
            href="/admin/canchas"
            className="px-6 py-3 rounded-xl text-zinc-400 font-bold hover:text-white transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-[#39ff14] text-black font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-[#32e612] transition-colors disabled:opacity-50"
          >
            {isPending ? 'Guardando...' : 'Guardar Cancha'}
          </button>
        </div>
      </form>
    </div>
  );
}

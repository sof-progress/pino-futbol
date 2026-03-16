'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { crearJugador, actualizarJugador } from '../../actions/jugadores';
import { FormMessage } from '../../components/FormMessage';
import Link from 'next/link';

interface JugadorFormProps {
    jugadorId?: string;
    equipos: { id: string; name: string }[];
    initialData?: {
        nombre: string;
        apellido: string;
        dni: string;
        posicion: string;
        equipoId: string;
    };
}

const posiciones = [
    { value: 'GOALKEEPER', label: 'Arquero' },
    { value: 'DEFENDER', label: 'Defensor' },
    { value: 'MIDFIELDER', label: 'Mediocampista' },
    { value: 'FORWARD', label: 'Delantero' },
];

export function JugadorForm({ jugadorId, equipos, initialData }: JugadorFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const isEditing = !!jugadorId;

    const handleSubmit = (formData: FormData) => {
        setMessage(null);
        startTransition(async () => {
            const result = isEditing
                ? await actualizarJugador(jugadorId, formData)
                : await crearJugador(formData);

            if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else if (result.success) {
                setMessage({ type: 'success', text: result.success });
                setTimeout(() => router.push('/admin/jugadores'), 1000);
            }
        });
    };

    return (
        <form action={handleSubmit} className="bg-[#111] border border-zinc-800 rounded-2xl p-6 space-y-6 max-w-lg">
            {message && <FormMessage type={message.type} message={message.text} />}

            {/* Nombre */}
            <div className="space-y-2">
                <label htmlFor="nombre" className="block text-sm font-medium text-zinc-400">
                    Nombre <span className="text-red-400">*</span>
                </label>
                <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    defaultValue={initialData?.nombre || ''}
                    placeholder="Ej: Juan"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#39ff14]/40 transition-all"
                />
            </div>

            {/* Apellido */}
            <div className="space-y-2">
                <label htmlFor="apellido" className="block text-sm font-medium text-zinc-400">
                    Apellido
                </label>
                <input
                    id="apellido"
                    name="apellido"
                    type="text"
                    defaultValue={initialData?.apellido || ''}
                    placeholder="Ej: Pérez"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#39ff14]/40 transition-all"
                />
            </div>

            {/* DNI */}
            <div className="space-y-2">
                <label htmlFor="dni" className="block text-sm font-medium text-zinc-400">
                    DNI
                </label>
                <input
                    id="dni"
                    name="dni"
                    type="text"
                    defaultValue={initialData?.dni || ''}
                    placeholder="Ej: 40123456"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#39ff14]/40 transition-all"
                />
            </div>

            {/* Posición */}
            <div className="space-y-2">
                <label htmlFor="posicion" className="block text-sm font-medium text-zinc-400">
                    Posición
                </label>
                <select
                    id="posicion"
                    name="posicion"
                    defaultValue={initialData?.posicion || ''}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#39ff14]/40 transition-all"
                >
                    <option value="">Seleccionar posición</option>
                    {posiciones.map((pos) => (
                        <option key={pos.value} value={pos.value}>{pos.label}</option>
                    ))}
                </select>
            </div>

            {/* Equipo */}
            <div className="space-y-2">
                <label htmlFor="equipoId" className="block text-sm font-medium text-zinc-400">
                    Equipo <span className="text-red-400">*</span>
                </label>
                <select
                    id="equipoId"
                    name="equipoId"
                    required
                    defaultValue={initialData?.equipoId || ''}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#39ff14]/40 transition-all"
                >
                    <option value="">Seleccionar equipo</option>
                    {equipos.map((eq) => (
                        <option key={eq.id} value={eq.id}>{eq.name}</option>
                    ))}
                </select>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-3 bg-[#39ff14] text-black font-bold text-sm rounded-xl hover:bg-[#39ff14]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Guardando...' : isEditing ? 'Actualizar jugador' : 'Crear jugador'}
                </button>
                <Link
                    href="/admin/jugadores"
                    className="px-6 py-3 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 text-sm rounded-xl transition-all flex items-center"
                >
                    Cancelar
                </Link>
            </div>
        </form>
    );
}

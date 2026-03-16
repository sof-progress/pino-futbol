'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { editarPartido } from '../../../actions/fixture';
import { FormMessage } from '../../../components/FormMessage';
import Link from 'next/link';

interface EditarPartidoFormProps {
    matchId: string;
    categorias: { id: string; name: string }[];
    equiposPorCategoria: Record<string, { id: string; name: string }[]>;
    canchas: { id: string; name: string }[];
    defaultValues: {
        categoriaId: string;
        equipoLocalId: string;
        equipoVisitanteId: string;
        fecha: string;
        venueId: string;
        canchaTextoLibre: string;
        jornada: string;
    };
}

export function EditarPartidoForm({ matchId, categorias, equiposPorCategoria, canchas, defaultValues }: EditarPartidoFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [selectedCategoria, setSelectedCategoria] = useState(defaultValues.categoriaId);
    const [equiposDisponibles, setEquiposDisponibles] = useState<{ id: string; name: string }[]>([]);

    // Actualizar equipos disponibles cuando cambia la categoría
    useEffect(() => {
        if (selectedCategoria && equiposPorCategoria[selectedCategoria]) {
            setEquiposDisponibles(equiposPorCategoria[selectedCategoria]);
        } else {
            setEquiposDisponibles([]);
        }
    }, [selectedCategoria, equiposPorCategoria]);

    const handleSubmit = (formData: FormData) => {
        setMessage(null);
        startTransition(async () => {
            const result = await editarPartido(matchId, formData);
            if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else if (result.success) {
                setMessage({ type: 'success', text: result.success });
                setTimeout(() => router.push('/admin/fixture'), 1000);
            }
        });
    };

    return (
        <form action={handleSubmit} className="bg-[#111] border border-zinc-800 rounded-2xl p-6 space-y-6 max-w-lg">
            {message && <FormMessage type={message.type} message={message.text} />}

            {/* Categoría */}
            <div className="space-y-2">
                <label htmlFor="categoriaId" className="block text-sm font-medium text-zinc-400">
                    Categoría <span className="text-red-400">*</span>
                </label>
                <select
                    id="categoriaId"
                    name="categoriaId"
                    required
                    value={selectedCategoria}
                    onChange={(e) => setSelectedCategoria(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#39ff14]/40 transition-all"
                >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* Equipo Local */}
            <div className="space-y-2">
                <label htmlFor="equipoLocalId" className="block text-sm font-medium text-zinc-400">
                    Equipo Local <span className="text-red-400">*</span>
                </label>
                <select
                    id="equipoLocalId"
                    name="equipoLocalId"
                    required
                    defaultValue={defaultValues.equipoLocalId}
                    disabled={!selectedCategoria}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#39ff14]/40 transition-all disabled:opacity-50"
                >
                    <option value="">Seleccionar equipo local</option>
                    {equiposDisponibles.map((eq) => (
                        <option key={eq.id} value={eq.id}>{eq.name}</option>
                    ))}
                </select>
            </div>

            {/* Equipo Visitante */}
            <div className="space-y-2">
                <label htmlFor="equipoVisitanteId" className="block text-sm font-medium text-zinc-400">
                    Equipo Visitante <span className="text-red-400">*</span>
                </label>
                <select
                    id="equipoVisitanteId"
                    name="equipoVisitanteId"
                    required
                    defaultValue={defaultValues.equipoVisitanteId}
                    disabled={!selectedCategoria}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#39ff14]/40 transition-all disabled:opacity-50"
                >
                    <option value="">Seleccionar equipo visitante</option>
                    {equiposDisponibles.map((eq) => (
                        <option key={eq.id} value={eq.id}>{eq.name}</option>
                    ))}
                </select>
            </div>

            {/* Fecha y Hora */}
            <div className="space-y-2">
                <label htmlFor="fecha" className="block text-sm font-medium text-zinc-400">
                    Fecha y Hora <span className="text-red-400">*</span>
                </label>
                <input
                    id="fecha"
                    name="fecha"
                    type="datetime-local"
                    required
                    defaultValue={defaultValues.fecha}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#39ff14]/40 transition-all [color-scheme:dark]"
                />
            </div>

            {/* Cancha */}
            <div className="space-y-2">
                <label htmlFor="venueId" className="block text-sm font-medium text-zinc-400">
                    Cancha
                </label>
                {canchas.length > 0 ? (
                    <select
                        id="venueId"
                        name="venueId"
                        defaultValue={defaultValues.venueId}
                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#39ff14]/40 transition-all"
                    >
                        <option value="">Seleccionar cancha (opcional)</option>
                        {canchas.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                ) : (
                    <div>
                        <input
                            id="canchaTextoLibre"
                            name="canchaTextoLibre"
                            type="text"
                            defaultValue={defaultValues.canchaTextoLibre}
                            placeholder="Ej: Cancha Enrique Pino"
                            className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#39ff14]/40 transition-all mb-2"
                        />
                        <p className="text-xs text-amber-500 font-medium">No hay canchas registradas en el módulo de Canchas. Agregá una allí para seleccionarla dinámicamente.</p>
                    </div>
                )}
            </div>

            {/* Jornada */}
            <div className="space-y-2">
                <label htmlFor="jornada" className="block text-sm font-medium text-zinc-400">
                    Número de Jornada
                </label>
                <input
                    id="jornada"
                    name="jornada"
                    type="number"
                    min="1"
                    defaultValue={defaultValues.jornada}
                    placeholder="Ej: 1"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#39ff14]/40 transition-all"
                />
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-3 bg-[#39ff14] text-black font-bold text-sm rounded-xl hover:bg-[#39ff14]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <Link
                    href="/admin/fixture"
                    className="px-6 py-3 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 text-sm rounded-xl transition-all flex items-center"
                >
                    Cancelar
                </Link>
            </div>
        </form>
    );
}

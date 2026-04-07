'use client';

import React from 'react';
import Image from 'next/image';

interface Team {
    name: string;
    neighborhood: string;
    logoUrl: string | null;
}

interface Standing {
    id: string;
    teamId: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
    team: Team;
}

interface StandingsTableProps {
    standings: Standing[];
    compact?: boolean; // Para uso en la Home (Top 5)
}

/**
 * Componente StandingsTable
 * Renderiza una tabla de posiciones profesional con estética neón
 */
export const StandingsTable: React.FC<StandingsTableProps> = ({ standings, compact = false }) => {
    if (!standings || standings.length === 0) {
        return (
            <div className="py-20 text-center bg-zinc-900/50 rounded-2xl border border-dashed border-surface-border">
                <p className="text-brand-secondary font-medium italic">No hay datos disponibles para esta categoría.</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/30 backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-brand-secondary font-bold">
                            <th className="px-3 py-4 text-center w-12">Pos</th>
                            <th className="px-4 py-4">Equipo</th>
                            <th className="px-2 py-4 text-center">PJ</th>
                            {!compact && (
                                <>
                                    <th className="px-2 py-4 text-center hidden sm:table-cell">PG</th>
                                    <th className="px-2 py-4 text-center hidden sm:table-cell">PE</th>
                                    <th className="px-2 py-4 text-center hidden sm:table-cell">PP</th>
                                    <th className="px-2 py-4 text-center hidden md:table-cell">GF</th>
                                    <th className="px-2 py-4 text-center hidden md:table-cell">GC</th>
                                </>
                            )}
                            <th className="px-2 py-4 text-center hidden sm:table-cell">DIF</th>
                            <th className="px-4 py-4 text-center text-brand-primary">PTS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        {standings.map((row, index) => {
                            const pos = index + 1;
                            const isFirst = pos === 1;
                            const isTop3 = pos <= 3;
                            const isClassificationZone = pos <= 8;
                            const isRelegationZone = pos > standings.length - 2 && standings.length > 5;
                            const diff = row.goalsFor - row.goalsAgainst;

                            // Colores para el podio
                            const posColor =
                                pos === 1 ? 'text-[#FFD700]' : // Oro
                                    pos === 2 ? 'text-[#C0C0C0]' : // Plata
                                        pos === 3 ? 'text-[#CD7F32]' : // Bronce
                                            'text-white';

                            return (
                                <tr
                                    key={row.id}
                                    className={`group transition-colors hover:bg-white/5 ${isFirst ? 'bg-brand-primary/[0.03]' : ''} 
                                        ${index === 7 ? 'border-b-2 border-brand-primary/20' : ''} 
                                        ${index === standings.length - 3 && standings.length > 5 ? 'border-b-2 border-red-500/20' : ''}
                                    `}
                                >
                                    <td className={`px-3 py-4 text-center font-black italic ${posColor} ${isTop3 ? 'text-lg' : ''}`}>
                                        {pos}°
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`relative w-8 h-8 rounded-full overflow-hidden bg-zinc-800 border ${isFirst ? 'border-brand-primary/30' : 'border-white/10'}`}>
                                                {row.team.logoUrl ? (
                                                    <Image
                                                        src={row.team.logoUrl}
                                                        alt={row.team.name}
                                                        fill
                                                        sizes="32px"
                                                        className="object-contain"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-[10px] font-bold text-brand-secondary">
                                                        {row.team.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className={`font-bold tracking-wide transition-colors group-hover:text-brand-primary ${isFirst ? 'text-white lg:text-base' : 'text-zinc-200'}`}>
                                                    {row.team.name}
                                                </div>
                                                <div className="text-[10px] text-brand-secondary uppercase font-medium">{row.team.neighborhood}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-2 py-4 text-center font-medium text-zinc-300">{row.played}</td>
                                    {!compact && (
                                        <>
                                            <td className="px-2 py-4 text-center hidden sm:table-cell text-brand-secondary">{row.won}</td>
                                            <td className="px-2 py-4 text-center hidden sm:table-cell text-brand-secondary">{row.drawn}</td>
                                            <td className="px-2 py-4 text-center hidden sm:table-cell text-brand-secondary">{row.lost}</td>
                                            <td className="px-2 py-4 text-center hidden md:table-cell text-brand-secondary">{row.goalsFor}</td>
                                            <td className="px-2 py-4 text-center hidden md:table-cell text-brand-secondary">{row.goalsAgainst}</td>
                                        </>
                                    )}
                                    <td className={`px-2 py-4 text-center hidden sm:table-cell font-bold ${diff > 0 ? 'text-emerald-500' : diff < 0 ? 'text-rose-500' : 'text-brand-secondary'}`}>
                                        {diff > 0 ? `+${diff}` : diff}
                                    </td>
                                    <td className="px-4 py-4 text-center font-black text-brand-primary text-base lg:text-lg drop-shadow-[0_0_8px_rgba(57,255,20,0.2)]">
                                        {row.points}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {!compact && (
                <div className="px-4 py-3 bg-black/40 border-t border-white/5 flex flex-wrap gap-4 text-[10px] uppercase font-bold tracking-widest">
                    <div className="flex items-center gap-1.5 text-brand-primary/60">
                        <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
                        Zona de Clasificación
                    </div>
                    <div className="flex items-center gap-1.5 text-rose-500/60">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        Zona de Descenso
                    </div>
                </div>
            )}
        </div>
    );
};

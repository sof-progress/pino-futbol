import { MatchStatus } from '@/types';

/**
 * Tipo que representa un partido con sus equipos incluidos
 */
type MatchWithTeams = {
    id: string;
    round: number | null;
    date: Date;
    status: MatchStatus;
    homeScore: number;
    awayScore: number;
    field: string | null;
    homeTeam: { name: string; logoUrl: string | null };
    awayTeam: { name: string; logoUrl: string | null };
};

/**
 * Agrupa un array de partidos por número de jornada.
 * Los partidos sin jornada asignada (round = null) van al final bajo la clave 9999.
 */
export function groupMatchesByMatchday(matches: MatchWithTeams[]) {
    return matches.reduce((grupos, partido) => {
        const jornada = partido.round ?? 9999;

        if (!grupos[jornada]) {
            grupos[jornada] = [];
        }

        grupos[jornada].push(partido);

        return grupos;
    }, {} as Record<number, MatchWithTeams[]>);
}
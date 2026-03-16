import prisma from "@/lib/prisma";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MatchCard } from "@/components/features/matches/MatchCard";
import { MatchWithTeams } from "@/types";
import { StandingsTable } from "@/components/features/standings/StandingsTable";
import { getStandingsByCategory } from "@/lib/actions/standings";
import Link from "next/link";

export default async function Home() {
  // Intentar traer datos si la DB está configurada, de lo contrario mostrar placeholders realistas
  let liveMatches: MatchWithTeams[] = [];
  let recentResults: MatchWithTeams[] = [];
  let upcomingMatches: MatchWithTeams[] = [];

  try {
    liveMatches = await prisma.match.findMany({
      where: { status: 'LIVE' },
      include: { homeTeam: true, awayTeam: true, venue: true },
      take: 2,
    });

    recentResults = await prisma.match.findMany({
      where: { status: 'FINISHED' },
      include: { homeTeam: true, awayTeam: true, venue: true },
      orderBy: { date: 'desc' },
      take: 4,
    });

    upcomingMatches = await prisma.match.findMany({
      where: { status: 'SCHEDULED' },
      include: { homeTeam: true, awayTeam: true, venue: true },
      orderBy: { date: 'asc' },
      take: 4,
    });
  } catch (error) {
    console.error("Database not connected, using mock data for demo.");

    // MOCK DATA PARA DEMO
    const mockTeams = [
      { id: '1', name: 'Deportivo Km 3' },
      { id: '2', name: 'Güer Aike FC' },
      { id: '3', name: 'Belgrano RG' },
      { id: '4', name: 'Petrolero Austral' },
      { id: '5', name: 'Boca RG' },
      { id: '6', name: 'Unión Santacruceña' },
    ];

    liveMatches = [{
      id: 'l1',
      homeTeam: mockTeams[4],
      awayTeam: mockTeams[5],
      homeScore: 1,
      awayScore: 2,
      status: 'LIVE',
      date: new Date(),
      field: 'Cancha El Cóndor'
    }] as MatchWithTeams[];

    recentResults = [
      {
        id: 'r1',
        homeTeam: mockTeams[0],
        awayTeam: mockTeams[1],
        homeScore: 2,
        awayScore: 1,
        status: 'FINISHED',
        date: new Date('2026-02-23T15:00:00Z'),
        field: 'Cancha Enrique Pino'
      },
      {
        id: 'r2',
        homeTeam: mockTeams[2],
        awayTeam: mockTeams[3],
        homeScore: 0,
        awayScore: 0,
        status: 'FINISHED',
        date: new Date('2026-02-20T17:00:00Z'),
        field: 'Cancha Nora Vera'
      }
    ] as MatchWithTeams[];

    upcomingMatches = [
      {
        id: 'u1',
        homeTeam: mockTeams[0],
        awayTeam: mockTeams[2],
        homeScore: 0,
        awayScore: 0,
        status: 'SCHEDULED',
        date: new Date('2026-03-01T16:00:00Z'),
        field: 'Cancha Enrique Pino'
      }
    ] as MatchWithTeams[];
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Sección En Vivo */}
      {liveMatches.length > 0 && (
        <section id="en-vivo">
          <SectionTitle
            title="En Vivo"
            subtitle="Partidos jugándose ahora"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveMatches.map((match) => (
              <MatchCard
                key={match.id}
                homeTeam={match.homeTeam.name}
                awayTeam={match.awayTeam.name}
                homeScore={match.homeScore}
                awayScore={match.awayScore}
                date={match.date}
                status={match.status}
                field={match.venue?.name || match.field || undefined}
                homeTeamLogo={match.homeTeam.logoUrl}
                awayTeamLogo={match.awayTeam.logoUrl}
              />
            ))}
          </div>
        </section>
      )}

      {/* Últimos Resultados */}
      <section id="resultados">
        <SectionTitle
          title="Últimos Resultados"
          subtitle="Partidos finalizados recientemente"
          action={{ label: "Ver todos", href: "/fixture" }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {recentResults.length > 0 ? (
            recentResults.map((match) => (
              <MatchCard
                key={match.id}
                homeTeam={match.homeTeam.name}
                awayTeam={match.awayTeam.name}
                homeScore={match.homeScore}
                awayScore={match.awayScore}
                date={match.date}
                status={match.status}
                field={match.venue?.name || match.field || undefined}
                homeTeamLogo={match.homeTeam.logoUrl}
                awayTeamLogo={match.awayTeam.logoUrl}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-zinc-900/50 rounded-xl border border-dashed border-zinc-800">
              <p className="text-zinc-500">No hay resultados recientes para mostrar.</p>
            </div>
          )}
        </div>
      </section>

      {/* Tabla de Posiciones Resumida (Top 5) */}
      <section id="posiciones-resumen">
        <SectionTitle
          title="Tabla de Posiciones"
          subtitle="Top 5 - Primera División"
          action={{ label: "Ver tabla completa", href: "/posiciones" }}
        />
        <div className="max-w-4xl">
          <StandingsResumen />
        </div>
      </section>

      {/* Próximos Encuentros */}
      <section id="proximos">
        <SectionTitle
          title="Próximos Encuentros"
          subtitle="No te pierdas de nada"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {upcomingMatches.length > 0 ? (
            upcomingMatches.map((match) => (
              <MatchCard
                key={match.id}
                homeTeam={match.homeTeam.name}
                awayTeam={match.awayTeam.name}
                homeScore={match.homeScore}
                awayScore={match.awayScore}
                date={match.date}
                status={match.status}
                field={match.venue?.name || match.field || undefined}
                homeTeamLogo={match.homeTeam.logoUrl}
                awayTeamLogo={match.awayTeam.logoUrl}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-400">Próximamente se publicará la nueva fecha.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/**
 * Componente para mostrar las posiciones resumidas en la Home
 */
async function StandingsResumen() {
  const standings = await getStandingsByCategory('Primera División A'); // Por defecto Primera División A para la Home
  const top5 = standings.slice(0, 5);

  return (
    <div className="space-y-4">
      <StandingsTable standings={top5 as any} compact={true} />
    </div>
  );
}

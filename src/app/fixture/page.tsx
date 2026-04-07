import { Suspense } from 'react';
import { Metadata } from 'next';
import { getCategories } from '@/lib/actions/standings';
import { getMatchesByCategory } from '@/lib/actions/matches';
import { groupMatchesByMatchday } from '@/lib/utils';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { CategoryDropdown } from '@/components/ui/CategoryDropdown';
import { MatchdayAccordion } from '@/components/ui/MatchdayAccordion';

export const metadata: Metadata = {
    title: 'Fixture — Pino Futbol | AIFB Río Gallegos',
    description: 'Consultá el fixture completo de todas las categorías de la Asociación Independiente de Fútbol de los Barrios de Río Gallegos.',
};

/**
 * Página de Fixture
 * Server Component que maneja el fetching inicial de categorías
 * Sigue el mismo patrón que posiciones/page.tsx
 */
export default async function FixturePage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const { category } = await searchParams;
    const categories = await getCategories();
    const activeCategoryName = category ||
        categories.find(c => c.name === 'Primera División A')?.name ||
        categories[0]?.name || '';

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <header className="space-y-2">
                <SectionTitle
                    title="Fixture"
                    subtitle="Calendario oficial de partidos — AIFB"
                />
            </header>

            {categories.length > 0 ? (
                <div className="space-y-8">
                    {/* Dropdown dinámico basado en las categorías de la DB */}
                    <div className="sticky top-[72px] z-20 py-2 -mx-4 px-4 bg-black/80 backdrop-blur-md flex justify-end">
                        <CategoryDropdown
                            categories={categories.map(c => c.name)}
                            activeCategory={activeCategoryName}
                            baseUrl="/fixture"
                        />
                    </div>

                    {/* Contenido del fixture con Suspense para mejor UX */}
                    <Suspense fallback={<FixtureSkeleton />}>
                        <FixtureContent categoryName={activeCategoryName} />
                    </Suspense>
                </div>
            ) : (
                <div className="py-20 text-center">
                    <p className="text-brand-secondary italic">
                        No se encontraron categorías configuradas.
                    </p>
                </div>
            )}
        </div>
    );
}

/**
 * Componente interno que trae y muestra los partidos
 * agrupados por jornada para una categoría específica
 */
async function FixtureContent({ categoryName }: { categoryName: string }) {
    const matches = await getMatchesByCategory(categoryName);
    const groupedMatches = groupMatchesByMatchday(matches);

    // Obtenemos los números de jornada ordenados de menor a mayor
    // El 9999 (partidos sin fecha) queda automáticamente al final
    const matchdays = Object.keys(groupedMatches)
        .map(Number)
        .sort((a, b) => a - b);

    if (matchdays.length === 0) {
        return (
            <div className="py-20 text-center">
                <p className="text-brand-secondary italic">
                    No hay partidos registrados para esta categoría.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {matchdays.map((matchday, i) => (
                <MatchdayAccordion
                    key={matchday}
                    matchday={matchday}
                    matches={groupedMatches[matchday] as any}
                    defaultOpen={i === 0}
                />
            ))}
        </div>
    );
}

/**
 * Skeleton loader mientras cargan los partidos
 */
function FixtureSkeleton() {
    return (
        <div className="space-y-10 animate-pulse">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4">
                    <div className="h-4 w-24 bg-white/5 rounded" />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(3)].map((_, j) => (
                            <div key={j} className="h-36 bg-white/5 rounded-xl" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

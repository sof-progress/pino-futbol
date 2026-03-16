import { Suspense } from 'react';
import { Metadata } from 'next';
import { getCategories, getStandingsByCategory } from '@/lib/actions/standings';
import { StandingsTable } from '@/components/features/standings/StandingsTable';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { CategoryTabs } from '@/components/ui/CategoryTabs';

export const metadata: Metadata = {
    title: 'Tabla de Posiciones — Pino Futbol | AIFB Río Gallegos',
    description: 'Consulta las posiciones actualizadas de todas las categorías de la Asociación Independiente de Fútbol de los Barrios de Río Gallegos.',
};

/**
 * Página de Posiciones
 * Server Component que maneja el fetching inicial de categorías
 */
export default async function PosicionesPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const { category } = await searchParams;
    const categories = await getCategories();
    const activeCategoryName = category || categories[0]?.name || '';

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <header className="space-y-2">
                <SectionTitle
                    title="Posiciones"
                    subtitle="Clasificación oficial de la AIFB"
                />
            </header>

            {categories.length > 0 ? (
                <div className="space-y-8">
                    {/* Tabs dinámicos basados en las categorías de la DB */}
                    <div className="sticky top-[72px] z-20 py-2 -mx-4 px-4 bg-black/80 backdrop-blur-md">
                        <CategoryTabs
                            categories={categories.map(c => c.name)}
                            activeTab={activeCategoryName}
                            baseUrl="/posiciones"
                        />
                    </div>

                    {/* Contenido de la tabla con Suspense para mejor UX */}
                    <Suspense fallback={<StandingsSkeleton />}>
                        <StandingsContent categoryName={activeCategoryName} />
                    </Suspense>
                </div>
            ) : (
                <div className="py-20 text-center">
                    <p className="text-zinc-500 italic">No se encontraron categorías configuradas.</p>
                </div>
            )}
        </div>
    );
}

/**
 * Componente interno para manejar el fetching de la tabla específica
 */
async function StandingsContent({ categoryName }: { categoryName: string }) {
    const standings = await getStandingsByCategory(categoryName);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <StandingsTable standings={standings as any} />
        </div>
    );
}

/**
 * Skeleton loader para la transición entre categorías
 */
function StandingsSkeleton() {
    return (
        <div className="w-full space-y-4 animate-pulse">
            <div className="h-12 bg-white/5 rounded-t-2xl"></div>
            {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-white/5 rounded-lg"></div>
            ))}
        </div>
    );
}

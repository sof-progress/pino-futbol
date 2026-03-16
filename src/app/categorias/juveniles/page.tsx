import React from 'react';
import { CategoryPageContent } from '@/components/features/standings/CategoryPageContent';

const tabs = [
    { id: 'cuarta', label: 'Cuarta' },
    { id: 'quinta', label: 'Quinta' }
];

export default function JuvenilesPage() {
    return (
        <CategoryPageContent
            title="Juveniles"
            subtitle="Asociación de Fútbol de los Barrios"
            tabs={tabs}
            isDevelopment={true}
        />
    );
}

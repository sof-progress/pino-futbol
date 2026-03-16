import React from 'react';
import { CategoryPageContent } from '@/components/features/standings/CategoryPageContent';

const tabs = [
    { id: 'a', label: 'A' },
    { id: 'b', label: 'B' },
    { id: 'c', label: 'C' }
];

export default function PrimeraPage() {
    return (
        <CategoryPageContent
            title="Primera"
            subtitle="División de Fútbol"
            tabs={tabs}
        />
    );
}

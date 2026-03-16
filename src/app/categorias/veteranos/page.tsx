import React from 'react';
import { CategoryPageContent } from '@/components/features/standings/CategoryPageContent';

const tabs = [
    { id: 'senior', label: 'Senior' },
    { id: 'super_senior', label: 'Super Senior' }
];

export default function VeteranosPage() {
    return (
        <CategoryPageContent
            title="Veteranos"
            subtitle="División mayor de Fútbol"
            tabs={tabs}
            isDevelopment={true}
        />
    );
}

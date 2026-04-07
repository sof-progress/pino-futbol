interface SectionTitleProps {
    title: string;
    subtitle?: string;
    action?: {
        label: string;
        href: string;
    };
}

import Link from 'next/link';

export function SectionTitle({ title, subtitle, action }: SectionTitleProps) {
    return (
        <div className="flex items-end justify-between mb-8 border-l-4 border-brand-primary pl-4">
            <div>
                <h2 className="text-2xl font-display font-black text-brand-primary uppercase tracking-tighter">{title}</h2>
                {subtitle && <p className="text-brand-primary/60 text-[10px] font-bold uppercase tracking-widest mt-1">{subtitle}</p>}
            </div>
            {action && (
                <Link href={action.href} className="text-xs font-black text-brand-primary hover:text-white uppercase tracking-widest transition-colors mb-1">
                    {action.label} ⚡
                </Link>
            )}
        </div>
    );
}

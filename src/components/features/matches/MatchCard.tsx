import { MatchStatus } from '@/types';
import { LiveBadge } from '@/components/ui/LiveBadge';
import Image from 'next/image';

interface MatchCardProps {
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    date: Date;
    status: MatchStatus;
    field?: string;
    homeTeamLogo?: string | null;
    awayTeamLogo?: string | null;
    category?: string | null;
}

export function MatchCard({ homeTeam, awayTeam, homeScore, awayScore, date, status, field, homeTeamLogo, awayTeamLogo, category }: MatchCardProps) {
    const isFinished = status === 'FINISHED';
    const isLive = status === 'LIVE';

    return (
        <div className="bg-surface border border-surface-border rounded-xl p-5 shadow-sm hover:border-brand-primary/50 transition-all duration-300">
            <div className="relative flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest z-10 bg-surface pr-2">
                    {field || 'Campo por definir'}
                </span>

                {category && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-[10px] font-black text-slate-200 bg-slate-200/10 px-2 py-0.5 rounded border border-slate-200/20 uppercase tracking-widest max-w-[50%] text-center truncate">
                            {category}
                        </span>
                    </div>
                )}

                <div className="z-10 bg-surface pl-2">
                    {isLive ? (
                        <LiveBadge />
                    ) : (
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {new Date(date).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex-1 flex flex-col items-center text-center gap-2">
                    <div className="relative w-12 h-12 bg-slate-950 border border-surface-border rounded-full flex items-center justify-center font-black text-brand-primary overflow-hidden">
                        {homeTeamLogo ? (
                            <Image src={homeTeamLogo} alt={homeTeam} fill sizes="48px" className="object-contain" unoptimized />
                        ) : (
                            homeTeam.substring(0, 1)
                        )}
                    </div>
                    <span className="font-bold text-sm leading-tight text-white uppercase tracking-tight">{homeTeam}</span>
                </div>

                <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                    <div className="flex items-center gap-3">
                        <span className={`text-3xl font-black italic ${isLive ? 'text-brand-primary' : 'text-foreground'}`}>{homeScore}</span>
                        <span className="text-slate-700 font-bold text-2xl">-</span>
                        <span className={`text-3xl font-black italic ${isLive ? 'text-brand-primary' : 'text-foreground'}`}>{awayScore}</span>
                    </div>
                    {isFinished && (
                        <span className="text-[10px] font-black text-slate-200 bg-slate-200/10 px-2 py-0.5 rounded border border-slate-200/20">FINAL</span>
                    )}
                </div>

                <div className="flex-1 flex flex-col items-center text-center gap-2">
                    <div className="relative w-12 h-12 bg-slate-950 border border-surface-border rounded-full flex items-center justify-center font-black text-brand-primary overflow-hidden">
                        {awayTeamLogo ? (
                            <Image src={awayTeamLogo} alt={awayTeam} fill sizes="48px" className="object-contain" unoptimized />
                        ) : (
                            awayTeam.substring(0, 1)
                        )}
                    </div>
                    <span className="font-bold text-sm leading-tight text-white uppercase tracking-tight">{awayTeam}</span>
                </div>
            </div>
        </div>
    );
}

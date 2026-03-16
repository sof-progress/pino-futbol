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
}

export function MatchCard({ homeTeam, awayTeam, homeScore, awayScore, date, status, field, homeTeamLogo, awayTeamLogo }: MatchCardProps) {
    const isFinished = status === 'FINISHED';
    const isLive = status === 'LIVE';

    return (
        <div className="bg-black border border-brand-neon/50 rounded-xl p-5 shadow-inner shadow-brand-neon/5 hover:border-brand-neon transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-brand-neon/60 uppercase tracking-widest">
                    {field || 'Campo por definir'}
                </span>
                {isLive ? (
                    <LiveBadge />
                ) : (
                    <span className="text-[10px] font-bold text-brand-neon/80 uppercase">
                        {new Date(date).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex-1 flex flex-col items-center text-center gap-2">
                    <div className="relative w-12 h-12 bg-zinc-900 border border-brand-neon/30 rounded-full flex items-center justify-center font-black text-brand-neon overflow-hidden">
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
                        <span className={`text-3xl font-black italic ${isLive ? 'text-brand-neon' : 'text-brand-neon/90'}`}>{homeScore}</span>
                        <span className="text-brand-neon/30 font-bold text-2xl">-</span>
                        <span className={`text-3xl font-black italic ${isLive ? 'text-brand-neon' : 'text-brand-neon/90'}`}>{awayScore}</span>
                    </div>
                    {isFinished && (
                        <span className="text-[10px] font-black text-brand-neon bg-brand-neon/10 px-2 py-0.5 rounded border border-brand-neon/20">FINAL</span>
                    )}
                </div>

                <div className="flex-1 flex flex-col items-center text-center gap-2">
                    <div className="relative w-12 h-12 bg-zinc-900 border border-brand-neon/30 rounded-full flex items-center justify-center font-black text-brand-neon overflow-hidden">
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

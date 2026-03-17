import prisma from '@/lib/prisma';
import Link from 'next/link';
import { CanchaRow } from './CanchaRow';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Canchas — Pino Fútbol Admin',
  robots: 'noindex, nofollow',
};

export default async function CanchasPage() {
  const canchas = await prisma.venue.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { matches: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider">Canchas</h1>
          <p className="text-zinc-400 mt-1">Gestioná los terrenos de juego de la AIFB</p>
        </div>
        <Link
          href="/admin/canchas/nueva"
          className="bg-[#39ff14] text-black px-4 py-2 rounded-xl font-bold hover:bg-[#32e612] transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nueva Cancha
        </Link>
      </div>

      <div className="bg-[#0d0d0d] border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-bold text-zinc-400">Nombre</th>
                <th className="px-6 py-4 font-bold text-zinc-400">Dirección</th>
                <th className="px-6 py-4 font-bold text-zinc-400 text-center">Partidos</th>
                <th className="px-6 py-4 font-bold text-zinc-400 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {canchas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    No hay canchas registradas
                  </td>
                </tr>
              ) : (
                canchas.map((cancha) => (
                  <CanchaRow 
                    key={cancha.id} 
                    id={cancha.id} 
                    name={cancha.name} 
                    address={cancha.address}
                    matchesCount={cancha._count.matches} 
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

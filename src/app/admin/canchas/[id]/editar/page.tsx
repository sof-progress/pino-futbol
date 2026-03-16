import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { CanchaForm } from '../../components/CanchaForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editar Cancha — Pino Fútbol Admin',
  robots: 'noindex, nofollow',
};

export default async function EditarCanchaPage({ params }: { params: { id: string } }) {
  const cancha = await prisma.venue.findUnique({
    where: { id: params.id },
  });

  if (!cancha) {
    notFound();
  }

  return <CanchaForm cancha={cancha} />;
}

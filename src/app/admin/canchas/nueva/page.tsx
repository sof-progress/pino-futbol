import { CanchaForm } from '../components/CanchaForm';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Nueva Cancha — Pino Fútbol Admin',
  robots: 'noindex, nofollow',
};

export default function NuevaCanchaPage() {
  return <CanchaForm />;
}

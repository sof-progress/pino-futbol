import Link from 'next/link';

/**
 * Página 404 personalizada de Pino Fútbol
 * Next.js la muestra automáticamente cuando una ruta no existe
 */
export default function NotFound() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 text-center">

            {/* Número 404 grande decorativo */}
            <h1 className="text-[120px] sm:text-[180px] font-black leading-none text-brand-primary/10 select-none">
                404
            </h1>

            {/* Ícono de pelota */}
            <div className="text-brand-primary mb-6 -mt-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a10 10 0 0 1 6.32 16.05L12 12V2z" />
                    <path d="M12 2a10 10 0 0 0-6.32 16.05L12 12V2z" />
                    <path d="M2.32 9h19.36" />
                    <path d="M2.32 15h19.36" />
                </svg>
            </div>

            {/* Mensaje principal */}
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white mb-3">
                Fuera de la cancha
            </h2>

            {/* Mensaje secundario */}
            <p className="text-brand-secondary text-sm sm:text-base max-w-sm mb-8">
                Esta página no existe o fue movida. Volvé al inicio para seguir el torneo.
            </p>

            {/* Botón volver */}
            <Link
                href="/"
                className="px-8 py-3 bg-brand-primary text-black font-black uppercase tracking-widest text-sm rounded-full hover:bg-brand-primary/90 transition-all duration-300 shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]"
            >
                Volver al inicio
            </Link>

        </div>
    );
}

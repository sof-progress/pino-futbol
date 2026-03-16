interface FormMessageProps {
    type: 'success' | 'error';
    message: string;
}

// Componente para mostrar mensajes de éxito o error en formularios
export function FormMessage({ type, message }: FormMessageProps) {
    if (!message) return null;

    const styles = {
        success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        error: 'bg-red-500/10 border-red-500/30 text-red-400',
    };

    const icons = {
        success: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
        error: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
        ),
    };

    return (
        <div className={`rounded-xl px-4 py-3 text-sm flex items-center gap-2 border ${styles[type]}`}>
            {icons[type]}
            {message}
        </div>
    );
}

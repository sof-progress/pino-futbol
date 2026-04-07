'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

// Diálogo de confirmación reutilizable para eliminaciones
export function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
            <div className="bg-surface border border-surface-border rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </div>
                    <h3 className="text-white font-bold text-lg">{title}</h3>
                </div>
                <p className="text-brand-secondary text-sm mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 text-sm text-brand-secondary hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all disabled:opacity-50"
                    >
                        {loading ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Hook reutilizable para gestionar el estado del diálogo de confirmación
export function useConfirmDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const resolveRef = useRef<((confirmed: boolean) => void) | null>(null);

    const confirm = useCallback((title: string, message: string): Promise<boolean> => {
        setIsOpen(true);
        return new Promise((resolve) => {
            resolveRef.current = resolve;
        });
    }, []);

    const handleConfirm = useCallback(() => {
        resolveRef.current?.(true);
        setIsOpen(false);
    }, []);

    const handleCancel = useCallback(() => {
        resolveRef.current?.(false);
        setIsOpen(false);
    }, []);

    useEffect(() => {
        return () => {
            resolveRef.current = null;
        };
    }, []);

    return { isOpen, loading, setLoading, confirm, handleConfirm, handleCancel };
}

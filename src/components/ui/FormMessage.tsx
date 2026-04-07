interface FormMessageProps {
  type: 'success' | 'error';
  message: string;
}

export function FormMessage({ type, message }: FormMessageProps) {
  if (!message) return null;

  return (
    <div
      className={`p-4 rounded-xl text-sm ${
        type === 'success'
          ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20'
          : 'bg-red-500/10 text-red-400 border border-red-500/20'
      }`}
    >
      {message}
    </div>
  );
}

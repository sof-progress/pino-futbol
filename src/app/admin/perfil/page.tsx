import PasswordChangeForm from './PasswordChangeForm';

export const dynamic = 'force-dynamic';

export default function PerfilPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Gestiona tu cuenta y cambia tu contraseña de acceso
        </p>
      </div>

      <div className="bg-[#111] border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Cambiar Contraseña</h2>
        <PasswordChangeForm />
      </div>
    </div>
  );
}

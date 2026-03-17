'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { compare, hash } from 'bcryptjs';

export async function cambiarPassword(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: 'No autorizado' };
    }

    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, error: 'Todos los campos son obligatorios' };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: 'La nueva contraseña y la confirmación no coinciden' };
    }

    if (newPassword.length < 8) {
      return { success: false, error: 'La nueva contraseña debe tener al menos 8 caracteres' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    const isPasswordValid = await compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return { success: false, error: 'La contraseña actual es incorrecta' };
    }

    const hashedPassword = await hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { success: true, message: 'Contraseña actualizada correctamente' };
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    return { success: false, error: 'Error interno del servidor. Inténtalo de nuevo más tarde.' };
  }
}

'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Obtener todas las canchas (útil para selects)
export async function getCanchas() {
  try {
    return await prisma.venue.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('Error al obtener canchas:', error);
    return [];
  }
}

// Obtener una cancha por ID
export async function getCanchaPorId(id: string) {
  try {
    return await prisma.venue.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error('Error al obtener cancha:', error);
    return null;
  }
}

// Crear nueva cancha
export async function crearCancha(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("No autorizado");
  }

  const nombre = formData.get('nombre') as string;
  const descripcion = formData.get('descripcion') as string;
  const direccion = formData.get('direccion') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const mapsUrl = formData.get('mapsUrl') as string;

  if (!nombre?.trim()) {
    return { error: 'El nombre de la cancha es obligatorio' };
  }

  try {
    await prisma.venue.create({
      data: {
        name: nombre.trim(),
        description: descripcion?.trim() || null,
        address: direccion?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        mapsUrl: mapsUrl?.trim() || null,
      },
    });

    revalidatePath('/admin/canchas');
    revalidatePath('/terrenos');
    return { success: 'Cancha creada correctamente' };
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('Unique')) {
      return { error: 'Ya existe una cancha con ese nombre' };
    }
    console.error('Error al crear cancha:', error);
    return { error: 'Error al crear la cancha' };
  }
}

// Actualizar cancha
export async function actualizarCancha(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("No autorizado");
  }

  const nombre = formData.get('nombre') as string;
  const descripcion = formData.get('descripcion') as string;
  const direccion = formData.get('direccion') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const mapsUrl = formData.get('mapsUrl') as string;

  if (!nombre?.trim()) {
    return { error: 'El nombre de la cancha es obligatorio' };
  }

  try {
    await prisma.venue.update({
      where: { id },
      data: {
        name: nombre.trim(),
        description: descripcion?.trim() || null,
        address: direccion?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        mapsUrl: mapsUrl?.trim() || null,
      },
    });

    revalidatePath('/admin/canchas');
    revalidatePath('/terrenos');
    return { success: 'Cancha actualizada correctamente' };
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('Unique')) {
      return { error: 'Ya existe una cancha con ese nombre' };
    }
    console.error('Error al actualizar cancha:', error);
    return { error: 'Error al actualizar la cancha' };
  }
}

// Eliminar cancha
export async function eliminarCancha(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("No autorizado");
  }

  try {
    const partidosVarios = await prisma.match.count({
      where: { venueId: id }
    });
    
    // Si tiene partidos asociados, podríamos no permitir borrarla, 
    // pero acá simplemente le quitamos la relación (set null)
    // o bloqueamos la eliminación dependiendo de la regla de negocio. 
    // Como la relación es String?, se puede setear en Null o Prisma lo hace si OnDelete es SetNull. 
    // Bloquearemos si hay partidos para cuidar la integridad.
    
    if (partidosVarios > 0) {
      return { error: `No se puede eliminar: tiene ${partidosVarios} partido(s) asignado(s)` };
    }

    await prisma.venue.delete({ where: { id } });
    
    revalidatePath('/admin/canchas');
    revalidatePath('/terrenos');
    return { success: 'Cancha eliminada correctamente' };
  } catch (error) {
    console.error('Error al eliminar cancha:', error);
    return { error: 'Error al eliminar la cancha' };
  }
}

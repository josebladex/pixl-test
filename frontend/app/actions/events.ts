'use server';

import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

async function getUserFromToken() {
  const token = cookies().get('token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function createEvent(data: { title: string; description: string; date: string; price: number }) {
  const user = await getUserFromToken();
  if (!user || user.role !== 'admin') {
    throw new Error('No autorizado');
  }
  const event = await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      price: data.price,
    },
  });
  return event;
}

export async function getEvents() {
  return await prisma.event.findMany();
}
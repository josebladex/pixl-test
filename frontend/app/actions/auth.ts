'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Credenciales inválidas');
  }
  const token = generateToken(user);
  cookies().set('token', token, { httpOnly: true, secure: true });
  return { message: 'Login exitoso' };
}

export async function register(email: string, password: string, role: string = 'user') {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('El usuario ya existe');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, role },
  });
  const token = generateToken(user);
  cookies().set('token', token, { httpOnly: true, secure: true });
  return { message: 'Registro exitoso' };
}
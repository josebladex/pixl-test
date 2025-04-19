import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ message: 'Wrong Credentials' }, { status: 401 });
  }

  const token = generateToken(user);

  const response = NextResponse.json({ message: 'Login successfully' });

  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
  });

  return response;
}

'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded !== 'object' || decoded === null) {
      return null;
    }

    return {
      id: (decoded as jwt.JwtPayload).id,
      email: (decoded as jwt.JwtPayload).email,
      role: (decoded as jwt.JwtPayload).role,
    };
  } catch {
    return null;
  }
}

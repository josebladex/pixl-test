import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export function generateToken(user: { id: number; email: string; role: string }) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, {
    expiresIn: '1h',
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY) as { id: number; email: string; role: string };
  } catch {
    return null;
  }
}

export function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'email' in decoded &&
      'role' in decoded
    ) {
      return {
        email: decoded.email as string,
        role: decoded.role as string,
      };
    }

    return null;
  } catch {
    return null;
  }
}

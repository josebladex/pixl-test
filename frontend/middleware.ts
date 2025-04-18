import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

async function getUserFromToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    if (payload && payload.email && payload.role) {
      return {
        email: payload.email as string,
        role: payload.role as string,
      };
    }
  } catch (err) {
    console.error('❌ Error verifying token:', err);
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  let user = null;
  if (token) {
    user = await getUserFromToken(token);
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/events')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/events/:path*'],
};

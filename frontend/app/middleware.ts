import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import type { NextRequest } from 'next/server';

interface User {
        role: string;
}

export function middleware(req: NextRequest): NextResponse {
        const token: string | undefined = req.cookies.get('token')?.value;
        const user: User | null = token ? verifyToken(token) as User : null;

        if (req.nextUrl.pathname.startsWith('/admin') && (!user || user.role !== 'admin')) {
                return NextResponse.redirect(new URL('/auth/login', req.url));
        }

        return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
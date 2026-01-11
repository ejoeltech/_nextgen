import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for login page and API routes
    if (pathname === '/admin/login' || pathname.startsWith('/api/admin/auth')) {
        return NextResponse.next();
    }

    // Check if accessing admin routes
    if (pathname.startsWith('/admin')) {
        const token = request.cookies.get('session')?.value;

        if (!token) {
            // Redirect to login if no token
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Verify token
        const session = await verifyToken(token);

        if (!session) {
            // Redirect to login if token is invalid
            const response = NextResponse.redirect(new URL('/admin/login', request.url));
            // Clear invalid cookie
            response.cookies.set('session', '', { maxAge: 0 });
            return response;
        }

        // Token is valid, allow access
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};

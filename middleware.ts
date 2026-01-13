import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Create response
    let response = NextResponse.next();

    // Add security headers to all responses
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
    );

    // Skip middleware for login page and auth API routes
    if (pathname === '/admin/login' || pathname.startsWith('/api/admin/auth')) {
        return response;
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
            const redirectResponse = NextResponse.redirect(new URL('/admin/login', request.url));
            // Clear invalid cookie
            redirectResponse.cookies.set('session', '', { maxAge: 0 });
            return redirectResponse;
        }

        // Check if token is about to expire (less than 1 hour left)
        const expiresAt = session.expiresAt;
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;

        if (expiresAt - now < oneHour) {
            // Token expiring soon - could implement refresh here
            console.log('Session expiring soon for user:', session.username);
        }

        // Token is valid, allow access
        return response;
    }

    return response;
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/:path*',
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};

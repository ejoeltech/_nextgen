import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Validate input
        if (!username || !password) {
            return NextResponse.json(
                { message: 'Username and password are required', success: false },
                { status: 400 }
            );
        }

        // Verify credentials
        const isValid = await verifyAdminCredentials(username, password);

        if (!isValid) {
            return NextResponse.json(
                { message: 'Invalid username or password', success: false },
                { status: 401 }
            );
        }

        // Create JWT token
        const token = await createToken(username);

        // Set HTTP-only cookie
        const response = NextResponse.json(
            { message: 'Login successful', success: true },
            { status: 200 }
        );

        response.cookies.set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}

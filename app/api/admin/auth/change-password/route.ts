import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hashPassword, verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        // Verify user is authenticated
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { currentPassword, newPassword } = body;

        // Validate required fields
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { message: 'Current password and new password are required', success: false },
                { status: 400 }
            );
        }

        // Validate new password strength
        if (newPassword.length < 8) {
            return NextResponse.json(
                { message: 'New password must be at least 8 characters long', success: false },
                { status: 400 }
            );
        }

        // Get current password hash from environment
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
        if (!adminPasswordHash) {
            return NextResponse.json(
                { message: 'Admin password not configured', success: false },
                { status: 500 }
            );
        }

        // Verify current password
        const isCurrentPasswordValid = await verifyPassword(currentPassword, adminPasswordHash);
        if (!isCurrentPasswordValid) {
            return NextResponse.json(
                { message: 'Current password is incorrect', success: false },
                { status: 400 }
            );
        }

        // Generate new password hash
        const newPasswordHash = await hashPassword(newPassword);

        // Return the new hash for manual update
        return NextResponse.json(
            {
                message: 'Password hash generated successfully',
                success: true,
                newPasswordHash,
                instructions: [
                    '1. Copy the new password hash below',
                    '2. Open your .env.local file',
                    '3. Update ADMIN_PASSWORD_HASH with the new hash',
                    '4. Restart your development server',
                    '5. Login with your new password'
                ]
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error changing password:', error);
        return NextResponse.json(
            { message: 'Failed to change password', success: false },
            { status: 500 }
        );
    }
}

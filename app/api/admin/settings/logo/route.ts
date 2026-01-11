import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const LOGO_PATH = path.join(process.cwd(), 'public', 'nextgen-logo.png');
const DEFAULT_LOGO_PATH = path.join(process.cwd(), 'public', 'nextgen-logo-default.png');

// POST - Upload new logo
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

        const formData = await request.formData();
        const file = formData.get('logo') as File;

        if (!file) {
            return NextResponse.json(
                { message: 'No file provided', success: false },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { message: 'Invalid file type. Only PNG, JPG, and SVG are allowed', success: false },
                { status: 400 }
            );
        }

        // Validate file size (2MB max)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { message: 'File too large. Maximum size is 2MB', success: false },
                { status: 400 }
            );
        }

        // Backup current logo if it exists (first time only)
        if (fs.existsSync(LOGO_PATH) && !fs.existsSync(DEFAULT_LOGO_PATH)) {
            fs.copyFileSync(LOGO_PATH, DEFAULT_LOGO_PATH);
        }

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Save the new logo
        fs.writeFileSync(LOGO_PATH, buffer);

        return NextResponse.json(
            { message: 'Logo uploaded successfully', success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error uploading logo:', error);
        return NextResponse.json(
            { message: 'Failed to upload logo', success: false },
            { status: 500 }
        );
    }
}

// DELETE - Reset to default logo
export async function DELETE() {
    try {
        // Verify user is authenticated
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        // Check if default logo exists
        if (!fs.existsSync(DEFAULT_LOGO_PATH)) {
            return NextResponse.json(
                { message: 'No default logo found', success: false },
                { status: 404 }
            );
        }

        // Restore default logo
        fs.copyFileSync(DEFAULT_LOGO_PATH, LOGO_PATH);

        return NextResponse.json(
            { message: 'Logo reset to default successfully', success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error resetting logo:', error);
        return NextResponse.json(
            { message: 'Failed to reset logo', success: false },
            { status: 500 }
        );
    }
}

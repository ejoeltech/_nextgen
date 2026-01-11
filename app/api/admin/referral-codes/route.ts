import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface ReferralCode {
    code: string;
    ownerName: string;
    ownerPhone: string;
    createdAt: string;
}

const dataPath = path.join(process.cwd(), 'data', 'referral-codes.json');

function readReferralCodes(): ReferralCode[] {
    try {
        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

function writeReferralCodes(codes: ReferralCode[]): void {
    fs.writeFileSync(dataPath, JSON.stringify(codes, null, 2), 'utf-8');
}

// GET - List all referral codes
export async function GET() {
    try {
        const codes = readReferralCodes();
        return NextResponse.json({ codes, success: true }, { status: 200 });
    } catch (error) {
        console.error('Error reading referral codes:', error);
        return NextResponse.json(
            { message: 'Failed to read referral codes', success: false },
            { status: 500 }
        );
    }
}

// POST - Create new referral code
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code, ownerName, ownerPhone } = body;

        // Validate required fields
        if (!code || !ownerName || !ownerPhone) {
            return NextResponse.json(
                { message: 'Missing required fields: code, ownerName, and ownerPhone are required', success: false },
                { status: 400 }
            );
        }

        // Validate code format (5 characters, uppercase)
        if (!/^[A-Z0-9]{5}$/.test(code)) {
            return NextResponse.json(
                { message: 'Code must be exactly 5 uppercase alphanumeric characters', success: false },
                { status: 400 }
            );
        }

        const codes = readReferralCodes();

        // Check if code already exists
        if (codes.some(c => c.code === code)) {
            return NextResponse.json(
                { message: 'A referral code with this code already exists', success: false },
                { status: 400 }
            );
        }

        // Create new referral code
        const newCode: ReferralCode = {
            code: code.toUpperCase(),
            ownerName,
            ownerPhone,
            createdAt: new Date().toISOString(),
        };

        codes.push(newCode);
        writeReferralCodes(codes);

        return NextResponse.json(
            { message: 'Referral code created successfully', code: newCode, success: true },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating referral code:', error);
        return NextResponse.json(
            { message: 'Failed to create referral code', success: false },
            { status: 500 }
        );
    }
}

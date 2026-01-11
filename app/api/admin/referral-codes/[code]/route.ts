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

// GET - Get single referral code
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;
        const codes = readReferralCodes();
        const referralCode = codes.find(c => c.code === code.toUpperCase());

        if (!referralCode) {
            return NextResponse.json(
                { message: 'Referral code not found', success: false },
                { status: 404 }
            );
        }

        return NextResponse.json({ code: referralCode, success: true }, { status: 200 });
    } catch (error) {
        console.error('Error reading referral code:', error);
        return NextResponse.json(
            { message: 'Failed to read referral code', success: false },
            { status: 500 }
        );
    }
}

// PUT - Update referral code
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;
        const body = await request.json();
        const { ownerName, ownerPhone } = body;

        // Validate required fields
        if (!ownerName || !ownerPhone) {
            return NextResponse.json(
                { message: 'Missing required fields: ownerName and ownerPhone are required', success: false },
                { status: 400 }
            );
        }

        const codes = readReferralCodes();
        const codeIndex = codes.findIndex(c => c.code === code.toUpperCase());

        if (codeIndex === -1) {
            return NextResponse.json(
                { message: 'Referral code not found', success: false },
                { status: 404 }
            );
        }

        // Update referral code
        codes[codeIndex] = {
            ...codes[codeIndex],
            ownerName,
            ownerPhone,
        };

        writeReferralCodes(codes);

        return NextResponse.json(
            { message: 'Referral code updated successfully', code: codes[codeIndex], success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating referral code:', error);
        return NextResponse.json(
            { message: 'Failed to update referral code', success: false },
            { status: 500 }
        );
    }
}

// DELETE - Delete referral code
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;
        const codes = readReferralCodes();
        const codeIndex = codes.findIndex(c => c.code === code.toUpperCase());

        if (codeIndex === -1) {
            return NextResponse.json(
                { message: 'Referral code not found', success: false },
                { status: 404 }
            );
        }

        codes.splice(codeIndex, 1);
        writeReferralCodes(codes);

        return NextResponse.json(
            { message: 'Referral code deleted successfully', success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting referral code:', error);
        return NextResponse.json(
            { message: 'Failed to delete referral code', success: false },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';

interface Conference {
    id: string;
    title: string;
    date: string;
    venue: string;
    description: string;
    qrCode: string;
    flierUrl?: string;
    advertiseOnHomepage?: boolean;
    createdAt: string;
    updatedAt: string;
}

const dataPath = path.join(process.cwd(), 'data', 'conferences.json');

function readConferences(): Conference[] {
    try {
        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

function writeConferences(conferences: Conference[]): void {
    fs.writeFileSync(dataPath, JSON.stringify(conferences, null, 2), 'utf-8');
}

async function generateQRCode(conferenceId: string): Promise<string> {
    try {
        // Generate QR code for the conference URL
        const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/conference/${conferenceId}`;
        const qrCodeDataUrl = await QRCode.toDataURL(url, {
            width: 300,
            margin: 2,
            color: {
                dark: '#0F5C4A', // Deep Green from design system
                light: '#F7F7F5', // Off-White from design system
            },
        });
        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating QR code:', error);
        return '';
    }
}

// GET - List all conferences
export async function GET() {
    try {
        const conferences = readConferences();
        return NextResponse.json({ conferences, success: true }, { status: 200 });
    } catch (error) {
        console.error('Error reading conferences:', error);
        return NextResponse.json(
            { message: 'Failed to read conferences', success: false },
            { status: 500 }
        );
    }
}

// POST - Create new conference
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, title, date, venue, description, flierData, flierName, advertiseOnHomepage } = body;

        // Validate required fields
        if (!id || !title || !date || !venue || !description) {
            return NextResponse.json(
                { message: 'Missing required fields: id, title, date, venue, and description are required', success: false },
                { status: 400 }
            );
        }

        const conferences = readConferences();

        // Check if ID already exists
        if (conferences.some(c => c.id === id)) {
            return NextResponse.json(
                { message: 'A conference with this ID already exists', success: false },
                { status: 400 }
            );
        }

        // Generate QR code
        const qrCode = await generateQRCode(id);

        // Handle flier upload if provided
        let flierUrl: string | undefined;
        if (flierData && flierName) {
            try {
                // Create conference-fliers directory if it doesn't exist
                const fliersDir = path.join(process.cwd(), 'public', 'conference-fliers');
                if (!fs.existsSync(fliersDir)) {
                    fs.mkdirSync(fliersDir, { recursive: true });
                }

                // Extract base64 data and save file
                const base64Data = flierData.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                const fileExtension = flierName.split('.').pop();
                const fileName = `${id}.${fileExtension}`;
                const filePath = path.join(fliersDir, fileName);

                fs.writeFileSync(filePath, buffer);
                flierUrl = `/conference-fliers/${fileName}`;
            } catch (error) {
                console.error('Error saving flier:', error);
                // Continue without flier if upload fails
            }
        }

        // Create new conference
        const newConference: Conference = {
            id,
            title,
            date,
            venue,
            description,
            qrCode,
            flierUrl,
            advertiseOnHomepage: advertiseOnHomepage || false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        conferences.push(newConference);
        writeConferences(conferences);

        return NextResponse.json(
            { message: 'Conference created successfully', conference: newConference, success: true },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating conference:', error);
        return NextResponse.json(
            { message: 'Failed to create conference', success: false },
            { status: 500 }
        );
    }
}

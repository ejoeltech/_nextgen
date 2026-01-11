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
        const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/conference/${conferenceId}`;
        const qrCodeDataUrl = await QRCode.toDataURL(url, {
            width: 300,
            margin: 2,
            color: {
                dark: '#0F5C4A',
                light: '#F7F7F5',
            },
        });
        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating QR code:', error);
        return '';
    }
}

// GET - Get single conference by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const conferences = readConferences();
        const conference = conferences.find(c => c.id === id);

        if (!conference) {
            return NextResponse.json(
                { message: 'Conference not found', success: false },
                { status: 404 }
            );
        }

        return NextResponse.json({ conference, success: true }, { status: 200 });
    } catch (error) {
        console.error('Error reading conference:', error);
        return NextResponse.json(
            { message: 'Failed to read conference', success: false },
            { status: 500 }
        );
    }
}

// PUT - Update conference
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { id: newId, title, date, venue, description, flierData, flierName, advertiseOnHomepage } = body;

        // Validate required fields
        if (!newId || !title || !date || !venue || !description) {
            return NextResponse.json(
                { message: 'Missing required fields: id, title, date, venue, and description are required', success: false },
                { status: 400 }
            );
        }

        const conferences = readConferences();
        const conferenceIndex = conferences.findIndex(c => c.id === id);

        if (conferenceIndex === -1) {
            return NextResponse.json(
                { message: 'Conference not found', success: false },
                { status: 404 }
            );
        }

        // Check if new ID already exists (excluding current conference)
        if (newId !== id && conferences.some(c => c.id === newId)) {
            return NextResponse.json(
                { message: 'A conference with this ID already exists', success: false },
                { status: 400 }
            );
        }

        // Regenerate QR code if ID changed
        const qrCode = newId !== id ? await generateQRCode(newId) : conferences[conferenceIndex].qrCode;

        // Handle flier upload if provided
        let flierUrl: string | undefined = conferences[conferenceIndex].flierUrl;
        if (flierData && flierName) {
            try {
                // Create conference-fliers directory if it doesn't exist
                const fliersDir = path.join(process.cwd(), 'public', 'conference-fliers');
                if (!fs.existsSync(fliersDir)) {
                    fs.mkdirSync(fliersDir, { recursive: true });
                }

                // Delete old flier if it exists and ID changed
                if (flierUrl && newId !== id) {
                    try {
                        const oldFilePath = path.join(process.cwd(), 'public', flierUrl);
                        if (fs.existsSync(oldFilePath)) {
                            fs.unlinkSync(oldFilePath);
                        }
                    } catch (error) {
                        console.error('Error deleting old flier:', error);
                    }
                }

                // Extract base64 data and save file
                const base64Data = flierData.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                const fileExtension = flierName.split('.').pop();
                const fileName = `${newId}.${fileExtension}`;
                const filePath = path.join(fliersDir, fileName);

                fs.writeFileSync(filePath, buffer);
                flierUrl = `/conference-fliers/${fileName}`;
            } catch (error) {
                console.error('Error saving flier:', error);
                // Continue with existing flier if upload fails
            }
        }

        // Update conference
        const updatedConference: Conference = {
            ...conferences[conferenceIndex],
            id: newId,
            title,
            date,
            venue,
            description,
            qrCode,
            flierUrl,
            advertiseOnHomepage: advertiseOnHomepage !== undefined ? advertiseOnHomepage : conferences[conferenceIndex].advertiseOnHomepage,
            updatedAt: new Date().toISOString(),
        };

        // If ID changed, we need to remove old and add new
        if (newId !== id) {
            conferences.splice(conferenceIndex, 1);
            conferences.push(updatedConference);
        } else {
            conferences[conferenceIndex] = updatedConference;
        }

        writeConferences(conferences);

        return NextResponse.json(
            { message: 'Conference updated successfully', conference: updatedConference, success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating conference:', error);
        return NextResponse.json(
            { message: 'Failed to update conference', success: false },
            { status: 500 }
        );
    }
}

// DELETE - Delete conference
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const conferences = readConferences();
        const conferenceIndex = conferences.findIndex(c => c.id === id);

        if (conferenceIndex === -1) {
            return NextResponse.json(
                { message: 'Conference not found', success: false },
                { status: 404 }
            );
        }

        conferences.splice(conferenceIndex, 1);
        writeConferences(conferences);

        return NextResponse.json(
            { message: 'Conference deleted successfully', success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting conference:', error);
        return NextResponse.json(
            { message: 'Failed to delete conference', success: false },
            { status: 500 }
        );
    }
}

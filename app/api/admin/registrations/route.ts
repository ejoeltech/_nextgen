import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface AttendanceRecord {
    id: string;
    conference_id: string;
    name: string;
    email: string;
    phone?: string;
    timestamp: string;
    attendedAt: string | null;
}

const dataPath = path.join(process.cwd(), 'data', 'attendance.json');

function readAttendance(): AttendanceRecord[] {
    try {
        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

function writeAttendance(records: AttendanceRecord[]): void {
    fs.writeFileSync(dataPath, JSON.stringify(records, null, 2), 'utf-8');
}

// GET - List all registrations with optional filtering
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const conferenceId = searchParams.get('conference_id');

        let records = readAttendance();

        // Filter by conference if specified
        if (conferenceId) {
            records = records.filter(r => r.conference_id === conferenceId);
        }

        return NextResponse.json({ registrations: records, success: true }, { status: 200 });
    } catch (error) {
        console.error('Error reading registrations:', error);
        return NextResponse.json(
            { message: 'Failed to read registrations', success: false },
            { status: 500 }
        );
    }
}

// PUT - Update attendance status
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, attendedAt } = body;

        if (!id) {
            return NextResponse.json(
                { message: 'Missing required field: id', success: false },
                { status: 400 }
            );
        }

        const records = readAttendance();
        const recordIndex = records.findIndex(r => r.id === id);

        if (recordIndex === -1) {
            return NextResponse.json(
                { message: 'Registration not found', success: false },
                { status: 404 }
            );
        }

        // Update attendance
        records[recordIndex].attendedAt = attendedAt !== undefined ? attendedAt : new Date().toISOString();
        writeAttendance(records);

        return NextResponse.json(
            { message: 'Attendance updated successfully', registration: records[recordIndex], success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating attendance:', error);
        return NextResponse.json(
            { message: 'Failed to update attendance', success: false },
            { status: 500 }
        );
    }
}

// DELETE - Delete registration
export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json(
                { message: 'Missing required field: id', success: false },
                { status: 400 }
            );
        }

        const records = readAttendance();
        const recordIndex = records.findIndex(r => r.id === id);

        if (recordIndex === -1) {
            return NextResponse.json(
                { message: 'Registration not found', success: false },
                { status: 404 }
            );
        }

        // Remove the registration
        records.splice(recordIndex, 1);
        writeAttendance(records);

        return NextResponse.json(
            { message: 'Registration deleted successfully', success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting registration:', error);
        return NextResponse.json(
            { message: 'Failed to delete registration', success: false },
            { status: 500 }
        );
    }
}

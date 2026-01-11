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

function convertToCSV(records: AttendanceRecord[]): string {
    if (records.length === 0) {
        return 'No data available';
    }

    // CSV headers
    const headers = ['ID', 'Conference ID', 'Name', 'Email', 'Phone', 'Registration Time', 'Attended At'];

    // CSV rows
    const rows = records.map(record => [
        record.id,
        record.conference_id,
        record.name,
        record.email,
        record.phone || '',
        new Date(record.timestamp).toLocaleString(),
        record.attendedAt ? new Date(record.attendedAt).toLocaleString() : 'Not attended',
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return csvContent;
}

// GET - Export registrations to CSV
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const conferenceId = searchParams.get('conference_id');

        let records = readAttendance();

        // Filter by conference if specified
        if (conferenceId) {
            records = records.filter(r => r.conference_id === conferenceId);
        }

        const csv = convertToCSV(records);
        const filename = conferenceId
            ? `registrations-${conferenceId}-${Date.now()}.csv`
            : `registrations-all-${Date.now()}.csv`;

        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error('Error exporting CSV:', error);
        return NextResponse.json(
            { message: 'Failed to export CSV', success: false },
            { status: 500 }
        );
    }
}

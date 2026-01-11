import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface AttendanceRecord {
  id: string;
  conference_id: string;
  name: string;
  email: string;
  phone: string;
  isRegisteredVoter: boolean;
  referralCode?: string;
  timestamp: string;
  attendedAt: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conference_id, name, email, phone, isRegisteredVoter, referralCode } = body;

    // Validate required fields
    if (!conference_id || !name || !email || !phone || typeof isRegisteredVoter !== 'boolean') {
      return NextResponse.json(
        { message: 'Missing required fields: conference_id, name, email, phone, and isRegisteredVoter are required', success: false },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format', success: false },
        { status: 400 }
      );
    }

    // Validate referral code if provided
    if (referralCode) {
      const referralCodesPath = path.join(process.cwd(), 'data', 'referral-codes.json');
      try {
        const referralCodesContent = fs.readFileSync(referralCodesPath, 'utf-8');
        const referralCodes = JSON.parse(referralCodesContent);
        const validCode = referralCodes.find((rc: any) => rc.code === referralCode.toUpperCase());

        if (!validCode) {
          return NextResponse.json(
            { message: 'Invalid referral code', success: false },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error('Error validating referral code:', error);
        return NextResponse.json(
          { message: 'Error validating referral code', success: false },
          { status: 500 }
        );
      }
    }

    // Create attendance record
    const record: AttendanceRecord = {
      id: Date.now().toString(),
      conference_id,
      name,
      email,
      phone,
      isRegisteredVoter,
      referralCode: referralCode ? referralCode.toUpperCase() : undefined,
      timestamp: new Date().toISOString(),
      attendedAt: null,
    };

    // Read existing attendance data
    const dataPath = path.join(process.cwd(), 'data', 'attendance.json');
    let attendanceData: AttendanceRecord[] = [];

    try {
      const fileContent = fs.readFileSync(dataPath, 'utf-8');
      attendanceData = JSON.parse(fileContent);
    } catch (error) {
      // If file doesn't exist or is empty, start with empty array
      attendanceData = [];
    }

    // Append new record
    attendanceData.push(record);

    // Write back to file
    fs.writeFileSync(dataPath, JSON.stringify(attendanceData, null, 2), 'utf-8');

    return NextResponse.json(
      { message: 'Attendance recorded', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error recording attendance:', error);
    return NextResponse.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

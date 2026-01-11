import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { hashPassword } from '@/lib/auth';
import { getSession } from '@/lib/auth';

export interface User {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    role: 'super_admin' | 'admin' | 'moderator' | 'viewer';
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}

const dataPath = path.join(process.cwd(), 'data', 'users.json');

function readUsers(): User[] {
    try {
        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

function writeUsers(users: User[]): void {
    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2), 'utf-8');
}

// GET - List all users
export async function GET() {
    try {
        // Verify user is authenticated
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        const users = readUsers();
        // Remove password hashes from response
        const safeUsers = users.map(({ passwordHash, ...user }) => user);

        return NextResponse.json({ users: safeUsers, success: true }, { status: 200 });
    } catch (error) {
        console.error('Error reading users:', error);
        return NextResponse.json(
            { message: 'Failed to read users', success: false },
            { status: 500 }
        );
    }
}

// POST - Create new user
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
        const { username, email, password, role } = body;

        // Validate required fields
        if (!username || !email || !password || !role) {
            return NextResponse.json(
                { message: 'Missing required fields: username, email, password, and role are required', success: false },
                { status: 400 }
            );
        }

        // Validate role
        const validRoles = ['super_admin', 'admin', 'moderator', 'viewer'];
        if (!validRoles.includes(role)) {
            return NextResponse.json(
                { message: 'Invalid role. Must be one of: super_admin, admin, moderator, viewer', success: false },
                { status: 400 }
            );
        }

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json(
                { message: 'Password must be at least 8 characters long', success: false },
                { status: 400 }
            );
        }

        const users = readUsers();

        // Check if username already exists
        if (users.some(u => u.username === username)) {
            return NextResponse.json(
                { message: 'A user with this username already exists', success: false },
                { status: 400 }
            );
        }

        // Check if email already exists
        if (users.some(u => u.email === email)) {
            return NextResponse.json(
                { message: 'A user with this email already exists', success: false },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create new user
        const newUser: User = {
            id: `user-${Date.now()}`,
            username,
            email,
            passwordHash,
            role,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true,
        };

        users.push(newUser);
        writeUsers(users);

        // Remove password hash from response
        const { passwordHash: _, ...safeUser } = newUser;

        return NextResponse.json(
            { message: 'User created successfully', user: safeUser, success: true },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { message: 'Failed to create user', success: false },
            { status: 500 }
        );
    }
}

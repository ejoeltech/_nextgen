import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { hashPassword } from '@/lib/auth';
import { getSession } from '@/lib/auth';
import { User } from '../route';

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

// GET - Get single user
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        const { id } = await params;
        const users = readUsers();
        const user = users.find(u => u.id === id);

        if (!user) {
            return NextResponse.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        const { passwordHash, ...safeUser } = user;
        return NextResponse.json({ user: safeUser, success: true }, { status: 200 });
    } catch (error) {
        console.error('Error reading user:', error);
        return NextResponse.json(
            { message: 'Failed to read user', success: false },
            { status: 500 }
        );
    }
}

// PUT - Update user
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const { email, role, isActive, newPassword } = body;

        const users = readUsers();
        const userIndex = users.findIndex(u => u.id === id);

        if (userIndex === -1) {
            return NextResponse.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        // Validate role if provided
        if (role) {
            const validRoles = ['super_admin', 'admin', 'moderator', 'viewer'];
            if (!validRoles.includes(role)) {
                return NextResponse.json(
                    { message: 'Invalid role', success: false },
                    { status: 400 }
                );
            }
        }

        // Check if email is already used by another user
        if (email && users.some(u => u.email === email && u.id !== id)) {
            return NextResponse.json(
                { message: 'Email already in use', success: false },
                { status: 400 }
            );
        }

        // Update user
        const updatedUser: User = {
            ...users[userIndex],
            email: email || users[userIndex].email,
            role: role || users[userIndex].role,
            isActive: isActive !== undefined ? isActive : users[userIndex].isActive,
            updatedAt: new Date().toISOString(),
        };

        // Update password if provided
        if (newPassword) {
            if (newPassword.length < 8) {
                return NextResponse.json(
                    { message: 'Password must be at least 8 characters long', success: false },
                    { status: 400 }
                );
            }
            updatedUser.passwordHash = await hashPassword(newPassword);
        }

        users[userIndex] = updatedUser;
        writeUsers(users);

        const { passwordHash, ...safeUser } = updatedUser;
        return NextResponse.json(
            { message: 'User updated successfully', user: safeUser, success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { message: 'Failed to update user', success: false },
            { status: 500 }
        );
    }
}

// DELETE - Delete user
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        const { id } = await params;
        const users = readUsers();
        const userIndex = users.findIndex(u => u.id === id);

        if (userIndex === -1) {
            return NextResponse.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        users.splice(userIndex, 1);
        writeUsers(users);

        return NextResponse.json(
            { message: 'User deleted successfully', success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { message: 'Failed to delete user', success: false },
            { status: 500 }
        );
    }
}

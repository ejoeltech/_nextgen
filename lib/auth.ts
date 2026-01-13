import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

export interface SessionPayload {
  username: string;
  expiresAt: number;
}

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify a password against a hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Create a JWT token
export async function createToken(username: string): Promise<string> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const token = await new SignJWT({ username, expiresAt: expiresAt.getTime() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(JWT_SECRET);

  return token;
}

// Verify a JWT token
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

// Get session from cookies
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

// Verify admin credentials
export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  // Normalize username input
  const normalizedUsername = username.trim();
  const adminUsername = (process.env.ADMIN_USERNAME || 'admin').trim();
  let adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  // Support base64-encoded hash for Windows compatibility
  const adminPasswordHashBase64 = process.env.ADMIN_PASSWORD_HASH_BASE64;
  if (adminPasswordHashBase64 && !adminPasswordHash) {
    adminPasswordHash = Buffer.from(adminPasswordHashBase64, 'base64').toString('utf-8');
  }

  // Debug logging
  console.log('=== Auth Debug ===');
  console.log('Input username:', JSON.stringify(username));
  console.log('Normalized username:', JSON.stringify(normalizedUsername));
  console.log('Expected username:', JSON.stringify(adminUsername));
  console.log('Username match:', normalizedUsername === adminUsername);
  console.log('ADMIN_PASSWORD_HASH exists:', !!adminPasswordHash);
  console.log('ADMIN_PASSWORD_HASH length:', adminPasswordHash?.length || 0);
  console.log('ADMIN_PASSWORD_HASH value:', adminPasswordHash);
  console.log('Using base64:', !!adminPasswordHashBase64);
  console.log('==================');

  if (!adminPasswordHash) {
    console.error('ADMIN_PASSWORD_HASH not set in environment variables');
    return false;
  }

  if (normalizedUsername !== adminUsername) {
    console.log('Username mismatch');
    return false;
  }

  const isValid = await verifyPassword(password, adminPasswordHash);
  console.log('Password verification result:', isValid);
  return isValid;
}

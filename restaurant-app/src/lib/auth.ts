import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { IUser } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

/**
 * Generates a JWT token for a user
 * @param user - The user object (must contain _id, email, role)
 */
export function generateToken(user: IUser) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, restaurant_id: user.restaurant_id }, // Payload
    JWT_SECRET, // Secret
    { expiresIn: '24h' } // Expiration
  );
}

/**
 * Verifies the JWT token from an incoming NextRequest
 * @param request - The Next.js API request object
 * @returns The decoded token payload or null if invalid
 */
export async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1]; // Get token from "Bearer <token>"

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as jwt.JwtPayload & { id: string; role: string; email: string };
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}
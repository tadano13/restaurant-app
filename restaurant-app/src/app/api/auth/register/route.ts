import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password, phone, role } = await request.json();

    // 1. Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 } // 409 Conflict
      );
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      phone,
      role: role || 'customer', // Default to 'customer' if not provided
    });

    await newUser.save();

    // 5. Generate a token
    const token = generateToken(newUser);

    // 6. Return response
    return NextResponse.json(
      {
        message: 'User registered successfully',
        token,
        user_id: newUser._id,
        role: newUser.role,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const { username, phoneOrEmail, country, password } = await req.json();

    // Validate input
    if (!username || !phoneOrEmail || !password || !country) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists (by email or phone)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: phoneOrEmail },
          { phone: phoneOrEmail }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email or phone number' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine if phoneOrEmail is email or phone
    const isEmail = phoneOrEmail.includes('@');
    
    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email: isEmail ? phoneOrEmail : "",
        phone: !isEmail ? phoneOrEmail : undefined,
        country,
        password: hashedPassword, // Store the hashed password
      },
    });

    // Remove password from response for security
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
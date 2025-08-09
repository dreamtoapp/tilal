import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { phone, password } = await request.json();

    // Check superadmin credentials
    if (phone === 'dreamtoapp' && password === 'dreamtoapp123456') {

      // Check if user exists
      const existingUser = await db.user.findUnique({
        where: { phone: 'dreamtoapp' }
      });

      if (!existingUser) {
        // Create superadmin user
        const newUser = await db.user.create({
          data: {
            phone: 'dreamtoapp',
            password: 'dreamtoapp123456',
            name: 'Super Admin',
            role: 'ADMIN',
            isOtp: false,
            isOauth: false
          }
        });

        return NextResponse.json({
          success: true,
          message: 'Superadmin created successfully',
          user: newUser
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Superadmin already exists',
        user: existingUser
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid superadmin credentials'
    }, { status: 401 });

  } catch (error) {
    console.error('Superadmin API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
} 
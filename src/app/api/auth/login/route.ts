import { NextRequest, NextResponse } from 'next/server';
import { UserService, LoginData } from '../../../../lib/userService';

export async function POST(request: NextRequest) {
  try {
    const body: LoginData = await request.json();
    
    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Authenticate user
    const userProfile = await UserService.authenticateUser(body);

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: userProfile.id,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        displayName: userProfile.displayName,
        isVerified: userProfile.isVerified
      }
    });

  } catch (error: unknown) {
    console.error('Login error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage === 'Invalid email or password') {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (errorMessage === 'Account is deactivated') {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      );
    }

    if (errorMessage === 'Account not set up for password authentication') {
      return NextResponse.json(
        { error: 'This account was created with a different authentication method' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

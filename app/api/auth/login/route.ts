import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { comparePassword, generateToken, hashPassword } from '@/lib/auth/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { username, password } = await request.json();
    
    // Check for hardcoded credentials
    if (username === 'admin' && password === 'admin123') {
      // Check if admin user exists in database
      let adminUser = await User.findOne({ username: 'admin' });
      
      // If not, create it
      if (!adminUser) {
        const hashedPassword = await hashPassword('admin123');
        adminUser = await User.create({
          username: 'admin',
          password: hashedPassword,
        });
      }
      
      // Generate JWT token
      const token = generateToken({
        userId: adminUser)._id),
        username: adminUser.username,
      });
      
      const response = NextResponse.json({
        success: true,
        user: {
          id: adminUser)._id),
          username: adminUser.username,
        },
      });
      
      // Set cookie
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      
      return response;
    }
    
    // For other users, check database
    const user = await User.findOne({ username });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const isValidPassword = await comparePassword(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const token = generateToken({
      userId: user)._id),
      username: user.username,
    });
    
    const response = NextResponse.json({
      success: true,
      user: {
        id: user)._id),
        username: user.username,
      },
    });
    
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}


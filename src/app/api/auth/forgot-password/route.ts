import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { SignJWT } from 'jose';
import nodemailer from 'nodemailer';
import { ObjectId } from 'mongodb';

// Force Node.js runtime
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Check if user exists
    const user = await db.collection('users').findOne({ email });
    
    // Always return success even if email doesn't exist (security best practice)
    // This prevents enumeration attacks
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return NextResponse.json({
        success: true,
        message: 'If your email exists in our system, you will receive a password reset link'
      });
    }
    
    // Create a reset token valid for 1 hour
    const token = await new SignJWT({ 
      userId: user._id.toString(),
      purpose: 'password-reset' 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .setIssuedAt()
      .sign(new TextEncoder().encode(process.env.JWT_SECRET || 'replace-with-secure-secret-in-env-file'));
    
    // Store reset token in database with expiration
    await db.collection('passwordResets').updateOne(
      { userId: new ObjectId(user._id) },
      { 
        $set: { 
          token,
          email,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
        }
      },
      { upsert: true }
    );
    
    // Create reset link
    const resetLink = `${request.nextUrl.origin}/reset-password?token=${token}`;
    
    // Configure nodemailer with debugging info
    console.log('Setting up email transport with:');
    console.log(`- Server: ${process.env.EMAIL_SERVER}`);
    console.log(`- Port: ${process.env.EMAIL_PORT}`);
    console.log(`- Secure: ${process.env.EMAIL_SECURE}`);
    console.log(`- From: ${process.env.EMAIL_FROM}`);
    
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER,
      port: parseInt(process.env.EMAIL_PORT || '465'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      debug: true // Enable debug logs
    });
    
    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (err) {
      console.error('SMTP verification failed:', err);
    }
    
    // Send email with verbose logging
    console.log(`Sending password reset email to: ${email}`);
    
    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Password Reset - Tech Details Shop',
        text: `
          Hello,
          
          You requested to reset your password for your Tech Details Shop account.
          
          Please click the link below to reset your password:
          ${resetLink}
          
          This link will expire in 1 hour.
          
          If you didn't request this, please ignore this email.
          
          Thank you,
          Tech Details Shop Team
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset</h2>
            <p>Hello,</p>
            <p>You requested to reset your password for your Tech Details Shop account.</p>
            <p>Please click the button below to reset your password:</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
            </p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Thank you,<br>Tech Details Shop Team</p>
          </div>
        `
      });
      
      console.log('Email sent successfully:', info.messageId);
    } catch (emailErr) {
      console.error('Email sending error:', emailErr);
      // Still return success to the user (don't expose email sending issues)
    }
    
    return NextResponse.json({
      success: true,
      message: 'If your email exists in our system, you will receive a password reset link'
    });
    
  } catch (error: any) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}
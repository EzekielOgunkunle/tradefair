import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { to, subject, html, type } = await request.json();

    if (!to || !subject || !html) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: to, subject, html',
        },
        { status: 400 }
      );
    }

    const result = await sendEmail({ to, subject, html });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      data: result.data,
    });
  } catch (error) {
    console.error('Error in send email API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send email',
      },
      { status: 500 }
    );
  }
}

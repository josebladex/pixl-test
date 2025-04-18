import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    (await cookies()).delete('token');

    return NextResponse.json({
      success: true,
      message: 'Logout successful',
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Error during logout' }, { status: 500 });
  }
}

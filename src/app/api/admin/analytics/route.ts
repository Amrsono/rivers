import { NextResponse } from 'next/server';
import { INITIAL_ADMIN_ANALYTICS } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_ADMIN_ANALYTICS,
  });
}

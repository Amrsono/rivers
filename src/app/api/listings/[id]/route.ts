import { NextResponse } from 'next/server';
import { INITIAL_LISTINGS } from '@/lib/mock-data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const listing = INITIAL_LISTINGS.find((l) => l.id === id);

  if (!listing) {
    return NextResponse.json(
      { success: false, message: 'Listing not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: listing,
  });
}

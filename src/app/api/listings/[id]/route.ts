import { NextResponse } from 'next/server';
import { INITIAL_LISTINGS } from '@/lib/mock-data';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return INITIAL_LISTINGS.map((l) => ({ id: l.id }));
}

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

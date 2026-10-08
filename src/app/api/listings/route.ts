import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
import { INITIAL_LISTINGS } from '@/lib/mock-data';
import { listingFormSchema } from '@/lib/schemas';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('category');
  const query = searchParams.get('query')?.toLowerCase();

  let filtered = [...INITIAL_LISTINGS];

  if (categoryId && categoryId !== 'all') {
    filtered = filtered.filter((l) => l.categoryId === categoryId);
  }

  if (query) {
    filtered = filtered.filter(
      (l) =>
        l.title.toLowerCase().includes(query) ||
        l.description.toLowerCase().includes(query) ||
        l.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    data: filtered,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = listingFormSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const createdListing = {
      id: `lst_${Date.now()}`,
      ...parseResult.data,
      status: 'ACTIVE',
      viewCount: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Listing successfully created on Rivers P2P marketplace',
        data: createdListing,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON payload' },
      { status: 400 }
    );
  }
}

import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
import { bnplCalculateSchema } from '@/lib/schemas';
import { BNPLBreakdown, InstallmentDetail } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = bnplCalculateSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, errors: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { price, installmentCount, frequency } = parseResult.data;
    const installmentAmount = Number((price / installmentCount).toFixed(2));

    const today = new Date();
    const schedule: InstallmentDetail[] = [];

    const intervalDays = frequency === 'WEEKLY' ? 7 : frequency === 'BI_WEEKLY' ? 14 : 30;

    for (let i = 0; i < installmentCount; i++) {
      const dueDate = new Date(today);
      dueDate.setDate(today.getDate() + i * intervalDays);

      schedule.push({
        installmentIndex: i + 1,
        dueDate: dueDate.toISOString(),
        amount: installmentAmount,
        status: i === 0 ? 'PAID' : 'UPCOMING',
      });
    }

    const breakdown: BNPLBreakdown = {
      totalPrice: price,
      installmentCount,
      installmentAmount,
      frequency,
      firstPaymentToday: installmentAmount,
      serviceFee: 0,
      schedule,
    };

    return NextResponse.json({
      success: true,
      message: 'Rivers Flow BNPL calculation breakdown generated',
      data: breakdown,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid calculation payload' },
      { status: 400 }
    );
  }
}

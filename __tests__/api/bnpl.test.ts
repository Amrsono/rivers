import { POST } from '@/app/api/bnpl/calculate/route';

describe('API: /api/bnpl/calculate', () => {
  it('should calculate valid BNPL breakdown with default parameters', async () => {
    const request = new Request('http://localhost:3000/api/bnpl/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: 1000 }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data.totalPrice).toBe(1000);
    expect(result.data.installmentCount).toBe(4);
    expect(result.data.frequency).toBe('BI_WEEKLY');
    expect(result.data.installmentAmount).toBe(250);
    expect(result.data.firstPaymentToday).toBe(250);
    expect(result.data.schedule).toHaveLength(4);
    expect(result.data.schedule[0].status).toBe('PAID');
    expect(result.data.schedule[1].status).toBe('UPCOMING');
  });

  it('should calculate valid schedule for monthly frequency and custom installments', async () => {
    const request = new Request('http://localhost:3000/api/bnpl/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        price: 6000,
        installmentCount: 6,
        frequency: 'MONTHLY',
      }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.data.installmentCount).toBe(6);
    expect(result.data.installmentAmount).toBe(1000);
    expect(result.data.frequency).toBe('MONTHLY');
    expect(result.data.schedule).toHaveLength(6);
  });

  it('should calculate valid schedule for weekly frequency', async () => {
    const request = new Request('http://localhost:3000/api/bnpl/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        price: 1400,
        installmentCount: 2,
        frequency: 'WEEKLY',
      }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.data.installmentCount).toBe(2);
    expect(result.data.installmentAmount).toBe(700);
    expect(result.data.frequency).toBe('WEEKLY');
  });

  it('should return 400 when price is non-positive', async () => {
    const request = new Request('http://localhost:3000/api/bnpl/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: -50 }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('should return 400 when installment count is outside allowed range (2-12)', async () => {
    const request = new Request('http://localhost:3000/api/bnpl/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: 1000, installmentCount: 15 }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('should return 400 for invalid json payload', async () => {
    const request = new Request('http://localhost:3000/api/bnpl/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'bad-json',
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid calculation payload');
  });
});

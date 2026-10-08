import { GET } from '@/app/api/ai/status/route';

describe('API: /api/ai/status', () => {
  const originalEnv = process.env.GEMINI_API_KEY;

  afterEach(() => {
    process.env.GEMINI_API_KEY = originalEnv;
  });

  it('should return isGeminiConfigured: false when GEMINI_API_KEY is not set', async () => {
    delete process.env.GEMINI_API_KEY;
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.isGeminiConfigured).toBe(false);
  });

  it('should return isGeminiConfigured: true when GEMINI_API_KEY is set', async () => {
    process.env.GEMINI_API_KEY = 'test-key-12345';
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.isGeminiConfigured).toBe(true);
  });
});

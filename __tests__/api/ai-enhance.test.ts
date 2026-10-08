import { POST } from '@/app/api/ai/enhance-listing/route';
import { NextRequest } from 'next/server';

describe('API: /api/ai/enhance-listing', () => {
  const originalEnv = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  afterEach(() => {
    process.env.GEMINI_API_KEY = originalEnv;
    jest.restoreAllMocks();
  });

  it('should return 400 when mode is missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/ai/enhance-listing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test Product' }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Missing required field: mode');
  });

  describe('Fallback modes when no Gemini API key is configured', () => {
    it('should generate fallback description in generate_description mode', async () => {
      const req = new NextRequest('http://localhost:3000/api/ai/enhance-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'generate_description',
          title: 'Quantum Computing Rig',
          condition: 'NEW',
        }),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.description).toContain('Quantum Computing Rig');
      expect(json.data.description).toContain('Rivers Marketplace');
    });

    it('should suggest price range in suggest_price mode', async () => {
      const req = new NextRequest('http://localhost:3000/api/ai/enhance-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'suggest_price',
          price: 1000,
        }),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.priceMin).toBe(850);
      expect(json.data.priceSuggested).toBe(950);
      expect(json.data.priceMax).toBe(1150);
    });

    it('should return tags in generate_tags mode', async () => {
      const req = new NextRequest('http://localhost:3000/api/ai/enhance-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'generate_tags',
          title: 'Mechanical Watch',
        }),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data.tags)).toBe(true);
      expect(json.data.tags.length).toBeGreaterThan(0);
    });

    it('should polish description in polish_description mode', async () => {
      const req = new NextRequest('http://localhost:3000/api/ai/enhance-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'polish_description',
          description: 'Selling my gaming setup.',
        }),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.polished).toContain('Selling my gaming setup.');
      expect(json.data.polished).toContain('Rivers Marketplace');
    });

    it('should detect category in detect_category mode', async () => {
      const req = new NextRequest('http://localhost:3000/api/ai/enhance-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'detect_category',
          title: 'Neural link headset',
        }),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.categoryId).toBe('cat_cyberware');
    });

    it('should score listing in score_listing mode', async () => {
      const req = new NextRequest('http://localhost:3000/api/ai/enhance-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'score_listing',
          title: 'VR Headset',
          price: 500,
          images: ['https://example.com/photo.jpg'],
        }),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.score).toBe(78);
      expect(Array.isArray(json.data.scoreBreakdown)).toBe(true);
    });
  });

  describe('Live Gemini flow with API key', () => {
    it('should call Gemini API when API key is provided and return parsed output', async () => {
      process.env.GEMINI_API_KEY = 'mock-gemini-key';

      const mockGeminiResponse = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    description: 'AI Generated description from Gemini model',
                  }),
                },
              ],
            },
          },
        ],
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockGeminiResponse,
      } as unknown as Response);

      const req = new NextRequest('http://localhost:3000/api/ai/enhance-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'generate_description',
          title: 'Supercar',
        }),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.description).toBe('AI Generated description from Gemini model');
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should gracefully degrade to mock fallback when Gemini API fails', async () => {
      process.env.GEMINI_API_KEY = 'failing-key';
      jest.spyOn(console, 'error').mockImplementation(() => {});

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as unknown as Response);

      const req = new NextRequest('http://localhost:3000/api/ai/enhance-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'generate_description',
          title: 'Supercar',
        }),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.description).toContain('Supercar');
    });
  });
});

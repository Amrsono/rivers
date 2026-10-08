import { GET, POST } from '@/app/api/listings/route';
import { INITIAL_LISTINGS } from '@/lib/mock-data';

describe('API: /api/listings', () => {
  describe('GET /api/listings', () => {
    it('should return all listings when no filter is provided', async () => {
      const request = new Request('http://localhost:3000/api/listings');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.total).toBe(INITIAL_LISTINGS.length);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should filter listings by category', async () => {
      const categoryId = 'cat_vehicles';
      const request = new Request(`http://localhost:3000/api/listings?category=${categoryId}`);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.every((item: { categoryId: string }) => item.categoryId === categoryId)).toBe(true);
    });

    it('should return all listings when category is "all"', async () => {
      const request = new Request('http://localhost:3000/api/listings?category=all');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.total).toBe(INITIAL_LISTINGS.length);
    });

    it('should filter listings by search query matching title or description', async () => {
      const query = 'carbon';
      const request = new Request(`http://localhost:3000/api/listings?query=${query}`);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);
      for (const item of data.data) {
        const matches =
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some((t: string) => t.toLowerCase().includes(query));
        expect(matches).toBe(true);
      }
    });

    it('should return empty list when search query does not match anything', async () => {
      const request = new Request('http://localhost:3000/api/listings?query=nonexistentqueryxyz999');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.total).toBe(0);
      expect(data.data).toEqual([]);
    });
  });

  describe('POST /api/listings', () => {
    it('should successfully create a listing with valid payload', async () => {
      const newListing = {
        title: 'Cyberpunk OLED Head-Mounted Rig',
        description: 'Brand new neural interface with dual micro-OLED panels and carbon frame.',
        price: 25000,
        currency: 'EGP',
        condition: 'NEW',
        categoryId: 'cat_cyberware',
        location: 'Cairo, Egypt',
        images: ['https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80'],
        tags: ['Cyberware', 'OLED', 'Neural'],
        flowFinanceEligible: true,
        safetyBadge: true,
      };

      const request = new Request('http://localhost:3000/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newListing),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.id).toMatch(/^lst_/);
      expect(data.data.title).toBe(newListing.title);
      expect(data.data.status).toBe('ACTIVE');
    });

    it('should return 400 when validation fails on invalid payload', async () => {
      const invalidListing = {
        title: 'Tiny', // < 5 chars
        description: 'Short', // < 20 chars
        price: -100, // Negative price
        condition: 'INVALID_CONDITION',
      };

      const request = new Request('http://localhost:3000/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidListing),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.errors).toBeDefined();
    });

    it('should return 400 when request body is not valid JSON', async () => {
      const request = new Request('http://localhost:3000/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid-json-{',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid JSON payload');
    });
  });
});

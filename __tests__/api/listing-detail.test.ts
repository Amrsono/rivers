import { GET } from '@/app/api/listings/[id]/route';
import { INITIAL_LISTINGS } from '@/lib/mock-data';

describe('API: /api/listings/[id]', () => {
  it('should return 200 and listing data when id exists', async () => {
    const existingListing = INITIAL_LISTINGS[0];
    const request = new Request(`http://localhost:3000/api/listings/${existingListing.id}`);
    const params = Promise.resolve({ id: existingListing.id });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.id).toBe(existingListing.id);
    expect(data.data.title).toBe(existingListing.title);
    expect(data.data.price).toBe(existingListing.price);
  });

  it('should return 404 when listing id does not exist', async () => {
    const request = new Request('http://localhost:3000/api/listings/lst_nonexistent_99999');
    const params = Promise.resolve({ id: 'lst_nonexistent_99999' });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.message).toBe('Listing not found');
  });
});

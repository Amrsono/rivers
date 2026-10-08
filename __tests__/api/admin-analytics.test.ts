import { GET } from '@/app/api/admin/analytics/route';
import { INITIAL_ADMIN_ANALYTICS } from '@/lib/mock-data';

describe('API: /api/admin/analytics', () => {
  it('should return 200 with platform analytics and metrics', async () => {
    const response = await GET();
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data.activeListings).toBe(INITIAL_ADMIN_ANALYTICS.activeListings);
    expect(result.data.totalMarketplaceGmv).toBe(INITIAL_ADMIN_ANALYTICS.totalMarketplaceGmv);
    expect(result.data.escrowVolume).toBe(INITIAL_ADMIN_ANALYTICS.escrowVolume);
    expect(result.data.userVerificationCount).toBe(INITIAL_ADMIN_ANALYTICS.userVerificationCount);
    expect(result.data.dailyTrafficCount).toBe(INITIAL_ADMIN_ANALYTICS.dailyTrafficCount);
    expect(result.data.bnplFinancedVolume).toBe(INITIAL_ADMIN_ANALYTICS.bnplFinancedVolume);
    expect(result.data.gmvGrowthPercent).toBe(INITIAL_ADMIN_ANALYTICS.gmvGrowthPercent);
    expect(Array.isArray(result.data.trafficSpikeData)).toBe(true);
    expect(Array.isArray(result.data.categoryBreakdown)).toBe(true);
    expect(Array.isArray(result.data.recentVerifications)).toBe(true);
  });
});

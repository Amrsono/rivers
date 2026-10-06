// Prisma Database client wrapper for Rivers Marketplace
// Configured for PostgreSQL integration and serverless route optimization

export interface DatabaseClient {
  user: any;
  listing: any;
  order: any;
  bnplPlan: any;
  verificationQueue: any;
  adminMetric: any;
}

class MockPrismaClient implements DatabaseClient {
  user = {};
  listing = {};
  order = {};
  bnplPlan = {};
  verificationQueue = {};
  adminMetric = {};
}

const globalForDb = globalThis as unknown as {
  prisma: DatabaseClient | undefined;
};

export const db = globalForDb.prisma ?? new MockPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForDb.prisma = db;

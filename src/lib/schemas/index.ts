import { z } from 'zod';

export const ItemConditionEnum = z.enum(['NEW', 'LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR']);
export type ItemConditionType = z.infer<typeof ItemConditionEnum>;

// Schema for listing creation form
export const listingFormSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters long' })
    .max(80, { message: 'Title cannot exceed 80 characters' }),
  description: z
    .string()
    .min(20, { message: 'Description must be at least 20 characters for trust & transparency' })
    .max(2000, { message: 'Description limit is 2000 characters' }),
  price: z
    .number()
    .positive({ message: 'Price must be greater than zero' }),
  currency: z.string().default('USD'),
  condition: ItemConditionEnum,
  categoryId: z.string().min(1, { message: 'Please select a category' }),
  location: z.string().min(3, { message: 'Location is required' }),
  images: z
    .array(z.string().url({ message: 'Must be a valid image URL' }))
    .min(1, { message: 'At least 1 product image is required' }),
  tags: z.array(z.string()).default([]),
  flowFinanceEligible: z.boolean().default(true),
  safetyBadge: z.boolean().default(true),
});

export type ListingFormValues = z.infer<typeof listingFormSchema>;

// Schema for BNPL installment calculation request
export const bnplCalculateSchema = z.object({
  price: z.number().positive(),
  installmentCount: z.number().int().min(2).max(12).default(4),
  frequency: z.enum(['WEEKLY', 'BI_WEEKLY', 'MONTHLY']).default('BI_WEEKLY'),
});

export type BNPLCalculateValues = z.infer<typeof bnplCalculateSchema>;

// Schema for search query parameters
export const searchQuerySchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  condition: ItemConditionEnum.optional(),
  bnplOnly: z.boolean().optional(),
  verifiedOnly: z.boolean().optional(),
  sortBy: z.enum(['newest', 'price_asc', 'price_desc', 'popular']).default('newest'),
});

export type SearchQueryValues = z.infer<typeof searchQuerySchema>;

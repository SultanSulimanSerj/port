// Auth DTOs
export * from './auth';

// Object DTOs  
export * from './object';

// Task DTOs
export * from './task';

// Approval DTOs
export * from './approval';

// Common DTOs
export const PaginationSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(20),
});

export const SortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const SearchSchema = z.object({
  search: z.string().optional(),
});

import { z } from 'zod';

export type Pagination = z.infer<typeof PaginationSchema>;
export type Sort = z.infer<typeof SortSchema>;
export type Search = z.infer<typeof SearchSchema>;
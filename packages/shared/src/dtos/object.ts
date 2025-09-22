import { z } from 'zod';
import { ObjectStatus, ObjectRole } from '../types';

export const CreateObjectRequestSchema = z.object({
  name: z.string().min(1, 'Название проекта обязательно'),
  description: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  budget: z.number().min(0).optional(),
  currency: z.string().optional(),
  location: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const UpdateObjectRequestSchema = z.object({
  name: z.string().min(1, 'Название проекта обязательно').optional(),
  description: z.string().optional(),
  status: z.nativeEnum(ObjectStatus).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  budget: z.number().min(0).optional(),
  currency: z.string().optional(),
  location: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const AddObjectMemberRequestSchema = z.object({
  userId: z.string().uuid('Неверный формат ID пользователя'),
  role: z.nativeEnum(ObjectRole),
  isResponsible: z.boolean().optional().default(false),
});

export const UpdateObjectMemberRequestSchema = z.object({
  role: z.nativeEnum(ObjectRole).optional(),
  isResponsible: z.boolean().optional(),
});

export const ObjectFilterSchema = z.object({
  status: z.nativeEnum(ObjectStatus).optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(20),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt', 'startDate']).optional().default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateObjectRequest = z.infer<typeof CreateObjectRequestSchema>;
export type UpdateObjectRequest = z.infer<typeof UpdateObjectRequestSchema>;
export type AddObjectMemberRequest = z.infer<typeof AddObjectMemberRequestSchema>;
export type UpdateObjectMemberRequest = z.infer<typeof UpdateObjectMemberRequestSchema>;
export type ObjectFilter = z.infer<typeof ObjectFilterSchema>;
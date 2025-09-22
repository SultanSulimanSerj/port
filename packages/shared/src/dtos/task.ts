import { z } from 'zod';
import { TaskStatus, TaskPriority } from '../types';

export const CreateTaskRequestSchema = z.object({
  name: z.string().min(1, 'Название задачи обязательно'),
  description: z.string().optional(),
  parentId: z.string().uuid().optional(),
  priority: z.nativeEnum(TaskPriority).optional().default(TaskPriority.MEDIUM),
  assigneeId: z.string().uuid().optional(),
  estimatedHours: z.number().min(0).optional(),
  startDate: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
});

export const UpdateTaskRequestSchema = z.object({
  name: z.string().min(1, 'Название задачи обязательно').optional(),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  assigneeId: z.string().uuid().optional(),
  estimatedHours: z.number().min(0).optional(),
  actualHours: z.number().min(0).optional(),
  startDate: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  orderIndex: z.number().optional(),
});

export const UpdateTaskOrderRequestSchema = z.object({
  taskId: z.string().uuid(),
  newIndex: z.number().int().min(0),
  parentId: z.string().uuid().optional(),
});

export const CreateMilestoneRequestSchema = z.object({
  name: z.string().min(1, 'Название этапа обязательно'),
  description: z.string().optional(),
  dueDate: z.string().datetime('Дата завершения обязательна'),
});

export const UpdateMilestoneRequestSchema = z.object({
  name: z.string().min(1, 'Название этапа обязательно').optional(),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  isCompleted: z.boolean().optional(),
});

export const CreateScheduleItemRequestSchema = z.object({
  taskId: z.string().uuid().optional(),
  milestoneId: z.string().uuid().optional(),
  name: z.string().min(1, 'Название элемента расписания обязательно'),
  startDate: z.string().datetime('Дата начала обязательна'),
  endDate: z.string().datetime('Дата окончания обязательна'),
  duration: z.number().min(1, 'Продолжительность должна быть больше 0'),
  dependsOnIds: z.array(z.string().uuid()).optional(),
});

export const UpdateScheduleItemRequestSchema = z.object({
  name: z.string().min(1).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  duration: z.number().min(1).optional(),
  dependsOnIds: z.array(z.string().uuid()).optional(),
  completedPercent: z.number().min(0).max(100).optional(),
});

export type CreateTaskRequest = z.infer<typeof CreateTaskRequestSchema>;
export type UpdateTaskRequest = z.infer<typeof UpdateTaskRequestSchema>;
export type UpdateTaskOrderRequest = z.infer<typeof UpdateTaskOrderRequestSchema>;
export type CreateMilestoneRequest = z.infer<typeof CreateMilestoneRequestSchema>;
export type UpdateMilestoneRequest = z.infer<typeof UpdateMilestoneRequestSchema>;
export type CreateScheduleItemRequest = z.infer<typeof CreateScheduleItemRequestSchema>;
export type UpdateScheduleItemRequest = z.infer<typeof UpdateScheduleItemRequestSchema>;
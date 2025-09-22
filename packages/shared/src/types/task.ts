import { UUID, Timestamp, TaskStatus, TaskPriority } from './index';

export interface Task {
  id: UUID;
  companyId: UUID;
  objectId: UUID;
  parentId?: UUID;
  name: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: UUID;
  reporterId: UUID;
  estimatedHours?: number;
  actualHours?: number;
  startDate?: Date;
  dueDate?: Date;
  completedAt?: Timestamp;
  orderIndex: number;
  tags?: string[];
  isArchived: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Milestone {
  id: UUID;
  companyId: UUID;
  objectId: UUID;
  name: string;
  description?: string;
  dueDate: Date;
  completedAt?: Timestamp;
  isCompleted: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ScheduleItem {
  id: UUID;
  companyId: UUID;
  objectId: UUID;
  taskId?: UUID;
  milestoneId?: UUID;
  name: string;
  startDate: Date;
  endDate: Date;
  duration: number; // in hours
  dependsOnIds?: UUID[];
  completedPercent: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
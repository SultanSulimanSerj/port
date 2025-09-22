import { UUID, Timestamp, ObjectStatus, ObjectRole } from './index';

export interface ProjectObject {
  id: UUID;
  companyId: UUID;
  name: string;
  description?: string;
  status: ObjectStatus;
  startDate?: Date;
  endDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  budget?: number;
  currency?: string;
  location?: string;
  tags?: string[];
  isArchived: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ObjectMember {
  id: UUID;
  objectId: UUID;
  userId: UUID;
  role: ObjectRole;
  isResponsible: boolean;
  joinedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
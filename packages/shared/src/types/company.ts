import { UUID, Timestamp } from './index';

export interface Company {
  id: UUID;
  name: string;
  slug: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
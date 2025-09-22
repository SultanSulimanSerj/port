import { UUID, Timestamp, UserRole } from './index';

export interface User {
  id: UUID;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserProfile extends User {
  memberships: Membership[];
}

export interface Membership {
  id: UUID;
  userId: UUID;
  companyId: UUID;
  role: UserRole;
  joinedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
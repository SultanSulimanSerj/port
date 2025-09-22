import { UUID, Timestamp, ApprovalStatus, ApprovalDecision, ApprovalRule, ApprovalContextType } from './index';

export interface ApprovalRequest {
  id: UUID;
  companyId: UUID;
  objectId?: UUID;
  title: string;
  description?: string;
  contextType: ApprovalContextType;
  contextId?: UUID;
  status: ApprovalStatus;
  currentStep: number;
  dueDate?: Date;
  completedAt?: Timestamp;
  createdById: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ApprovalStep {
  id: UUID;
  requestId: UUID;
  index: number;
  name: string;
  rule: ApprovalRule;
  quorumSize?: number;
  dueDate?: Date;
  completedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ApprovalAssignee {
  id: UUID;
  stepId: UUID;
  userId: UUID;
  decision: ApprovalDecision;
  decidedAt?: Timestamp;
  comment?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ApprovalPolicy {
  id: UUID;
  companyId: UUID;
  name: string;
  contextType: ApprovalContextType;
  conditions: Record<string, any>;
  steps: {
    name: string;
    rule: ApprovalRule;
    roles: string[];
    quorumSize?: number;
  }[];
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ApprovalEvent {
  id: UUID;
  requestId: UUID;
  userId: UUID;
  action: string;
  details?: Record<string, any>;
  createdAt: Timestamp;
}
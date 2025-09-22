import { UUID, Timestamp, DocumentType, NumberingPeriodScope } from './index';

export interface NumberingRule {
  id: UUID;
  companyId: UUID;
  documentType: DocumentType;
  mask: string;
  periodScope: NumberingPeriodScope;
  useProjectScope: boolean;
  useBranchScope: boolean;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface NumberingSequence {
  id: UUID;
  companyId: UUID;
  documentType: DocumentType;
  periodKey: string; // e.g., "2024", "2024-03", or "all"
  projectKey?: string;
  branchKey?: string;
  nextSeq: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface IdempotentRequest {
  id: UUID;
  key: string;
  fingerprint: string;
  response?: any;
  createdAt: Timestamp;
}
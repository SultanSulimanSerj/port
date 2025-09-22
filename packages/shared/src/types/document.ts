import { UUID, Timestamp, DocumentType, DocumentStatus, TemplateEngine } from './index';

export interface Document {
  id: UUID;
  companyId: UUID;
  objectId: UUID;
  name: string;
  description?: string;
  mimeType: string;
  fileSize: number;
  storageKey: string;
  version: number;
  previousVersionId?: UUID;
  uploadedById: UUID;
  isLatest: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DocTemplate {
  id: UUID;
  companyId: UUID;
  name: string;
  type: DocumentType;
  engine: TemplateEngine;
  placeholders: Record<string, any>;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DocTemplateVersion {
  id: UUID;
  templateId: UUID;
  storageKey: string;
  version: number;
  changelog?: string;
  createdById: UUID;
  createdAt: Timestamp;
}

export interface GeneratedDocument {
  id: UUID;
  companyId: UUID;
  objectId?: UUID;
  kind: DocumentType;
  number?: string;
  status: DocumentStatus;
  templateId?: UUID;
  data: Record<string, any>;
  fileKey?: string;
  approvalRequestId?: UUID;
  generatedById: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
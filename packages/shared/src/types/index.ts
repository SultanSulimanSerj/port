// Base types
export type UUID = string;
export type Timestamp = Date;

// User & Company types
export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  PM = 'PM',
  WORKER = 'WORKER',
  VIEWER = 'VIEWER'
}

export enum ObjectRole {
  LEAD = 'LEAD',
  ENGINEER = 'ENGINEER', 
  SUPERVISOR = 'SUPERVISOR',
  VIEWER = 'VIEWER'
}

// Object/Project types
export enum ObjectStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// Finance types
export enum ExpenseCategory {
  MATERIALS = 'MATERIALS',
  CONTRACTOR = 'CONTRACTOR',
  RENT = 'RENT',
  LABOR = 'LABOR',
  OTHER = 'OTHER'
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  RUB = 'RUB'
}

// Task types
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

// Approval types
export enum ApprovalStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export enum ApprovalDecision {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED', 
  REJECTED = 'REJECTED'
}

export enum ApprovalRule {
  ALL = 'ALL',
  ANY = 'ANY',
  QUORUM = 'QUORUM'
}

export enum ApprovalContextType {
  DOCUMENT = 'DOCUMENT',
  CHANGE = 'CHANGE',
  OTHER = 'OTHER'
}

// Document types
export enum DocumentType {
  CONTRACT = 'CONTRACT',
  PROPOSAL = 'PROPOSAL',
  ACT = 'ACT',
  UPD = 'UPD',
  KS2 = 'KS2',
  KS3 = 'KS3',
  OTHER = 'OTHER'
}

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  VOIDED = 'VOIDED'
}

export enum TemplateEngine {
  HTML = 'HTML',
  DOCX = 'DOCX'
}

// Numbering types
export enum NumberingPeriodScope {
  NONE = 'NONE',
  YEAR = 'YEAR',
  MONTH = 'MONTH'
}

// Export all types
export * from './user';
export * from './company';
export * from './object';
export * from './document';
export * from './task';
export * from './finance';
export * from './approval';
export * from './chat';
export * from './numbering';
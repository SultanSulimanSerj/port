import { UUID, Timestamp, ExpenseCategory, Currency } from './index';

export interface Expense {
  id: UUID;
  companyId: UUID;
  objectId: UUID;
  category: ExpenseCategory;
  amount: number;
  currency: Currency;
  date: Date;
  vendor?: string;
  description?: string;
  receiptUrl?: string;
  linkedTaskId?: UUID;
  createdById: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Revenue {
  id: UUID;
  companyId: UUID;
  objectId: UUID;
  amount: number;
  currency: Currency;
  date: Date;
  invoiceNo?: string;
  description?: string;
  documentUrl?: string;
  createdById: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BudgetLine {
  id: UUID;
  companyId: UUID;
  objectId: UUID;
  costCode: string;
  name: string;
  planned: number;
  committed: number;
  actual: number;
  eac: number; // Estimate at Completion
  currency: Currency;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FinanceSummary {
  objectId: UUID;
  totalExpenses: number;
  totalRevenues: number;
  margin: number;
  marginPercent: number;
  currency: Currency;
  expensesByCategory: Record<ExpenseCategory, number>;
  revenuesByMonth: Record<string, number>;
  expensesByMonth: Record<string, number>;
}
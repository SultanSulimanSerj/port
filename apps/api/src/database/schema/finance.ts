import { relations } from 'drizzle-orm';
import { date, numeric, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { objects } from './objects';
import { tasks } from './tasks';
import { users } from './users';

export const expenses = pgTable('expenses', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  objectId: uuid('object_id').notNull().references(() => objects.id, { onDelete: 'cascade' }),
  category: varchar('category', { length: 50 }).notNull(), // MATERIALS, CONTRACTOR, RENT, LABOR, OTHER
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull(),
  date: date('date').notNull(),
  vendor: varchar('vendor', { length: 255 }),
  description: text('description'),
  receiptUrl: text('receipt_url'),
  linkedTaskId: uuid('linked_task_id').references(() => tasks.id),
  createdById: uuid('created_by_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const revenues = pgTable('revenues', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  objectId: uuid('object_id').notNull().references(() => objects.id, { onDelete: 'cascade' }),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull(),
  date: date('date').notNull(),
  invoiceNo: varchar('invoice_no', { length: 100 }),
  description: text('description'),
  documentUrl: text('document_url'),
  createdById: uuid('created_by_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const budgetLines = pgTable('budget_lines', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  objectId: uuid('object_id').notNull().references(() => objects.id, { onDelete: 'cascade' }),
  costCode: varchar('cost_code', { length: 100 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  planned: numeric('planned', { precision: 15, scale: 2 }).default('0').notNull(),
  committed: numeric('committed', { precision: 15, scale: 2 }).default('0').notNull(),
  actual: numeric('actual', { precision: 15, scale: 2 }).default('0').notNull(),
  eac: numeric('eac', { precision: 15, scale: 2 }).default('0').notNull(), // Estimate at Completion
  currency: varchar('currency', { length: 3 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const expensesRelations = relations(expenses, ({ one }) => ({
  company: one(companies, {
    fields: [expenses.companyId],
    references: [companies.id],
  }),
  object: one(objects, {
    fields: [expenses.objectId],
    references: [objects.id],
  }),
  linkedTask: one(tasks, {
    fields: [expenses.linkedTaskId],
    references: [tasks.id],
  }),
  createdBy: one(users, {
    fields: [expenses.createdById],
    references: [users.id],
  }),
}));

export const revenuesRelations = relations(revenues, ({ one }) => ({
  company: one(companies, {
    fields: [revenues.companyId],
    references: [companies.id],
  }),
  object: one(objects, {
    fields: [revenues.objectId],
    references: [objects.id],
  }),
  createdBy: one(users, {
    fields: [revenues.createdById],
    references: [users.id],
  }),
}));

export const budgetLinesRelations = relations(budgetLines, ({ one }) => ({
  company: one(companies, {
    fields: [budgetLines.companyId],
    references: [companies.id],
  }),
  object: one(objects, {
    fields: [budgetLines.objectId],
    references: [objects.id],
  }),
}));
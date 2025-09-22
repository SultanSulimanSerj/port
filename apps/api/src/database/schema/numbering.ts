import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { companies } from './companies';

export const numberingRules = pgTable('numbering_rules', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  documentType: varchar('document_type', { length: 50 }).notNull(), // CONTRACT, PROPOSAL, KS2, KS3, etc.
  mask: varchar('mask', { length: 255 }).notNull(), // e.g., "PROP-{YYYY}-{SEQ:4}"
  periodScope: varchar('period_scope', { length: 20 }).default('YEAR').notNull(), // NONE, YEAR, MONTH
  useProjectScope: boolean('use_project_scope').default(false).notNull(),
  useBranchScope: boolean('use_branch_scope').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const numberingSequences = pgTable('numbering_sequences', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  documentType: varchar('document_type', { length: 50 }).notNull(),
  periodKey: varchar('period_key', { length: 20 }).notNull(), // e.g., "2024", "2024-03", "all"
  projectKey: varchar('project_key', { length: 100 }),
  branchKey: varchar('branch_key', { length: 100 }),
  nextSeq: integer('next_seq').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const idempotentRequests = pgTable('idempotent_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: varchar('key', { length: 255 }).notNull().unique(),
  fingerprint: text('fingerprint').notNull(),
  response: text('response'), // JSON
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const numberingRulesRelations = relations(numberingRules, ({ one, many }) => ({
  company: one(companies, {
    fields: [numberingRules.companyId],
    references: [companies.id],
  }),
  sequences: many(numberingSequences),
}));

export const numberingSequencesRelations = relations(numberingSequences, ({ one }) => ({
  company: one(companies, {
    fields: [numberingSequences.companyId],
    references: [companies.id],
  }),
}));
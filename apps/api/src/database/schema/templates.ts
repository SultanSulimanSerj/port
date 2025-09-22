import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { objects } from './objects';
import { users } from './users';

export const docTemplates = pgTable('doc_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // CONTRACT, PROPOSAL, ACT, UPD, KS2, KS3, OTHER
  engine: varchar('engine', { length: 50 }).notNull(), // HTML, DOCX
  placeholders: text('placeholders'), // JSON
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const docTemplateVersions = pgTable('doc_template_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  templateId: uuid('template_id').notNull().references(() => docTemplates.id, { onDelete: 'cascade' }),
  storageKey: text('storage_key').notNull(),
  version: integer('version').notNull(),
  changelog: text('changelog'),
  createdById: uuid('created_by_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const generatedDocuments = pgTable('generated_documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  objectId: uuid('object_id').references(() => objects.id),
  kind: varchar('kind', { length: 50 }).notNull(), // CONTRACT, PROPOSAL, ACT, UPD, KS2, KS3, WORK_ACT
  number: varchar('number', { length: 100 }),
  status: varchar('status', { length: 50 }).default('DRAFT').notNull(), // DRAFT, ACTIVE, ARCHIVED, VOIDED
  templateId: uuid('template_id').references(() => docTemplates.id),
  data: text('data'), // JSON
  fileKey: text('file_key'),
  approvalRequestId: uuid('approval_request_id'),
  generatedById: uuid('generated_by_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const counterparties = pgTable('counterparties', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  legalName: varchar('legal_name', { length: 255 }),
  inn: varchar('inn', { length: 20 }),
  kpp: varchar('kpp', { length: 20 }),
  ogrn: varchar('ogrn', { length: 20 }),
  address: text('address'),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  contactPerson: varchar('contact_person', { length: 255 }),
  bankAccount: varchar('bank_account', { length: 20 }),
  bankName: varchar('bank_name', { length: 255 }),
  bik: varchar('bik', { length: 9 }),
  corrAccount: varchar('corr_account', { length: 20 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const docTemplatesRelations = relations(docTemplates, ({ one, many }) => ({
  company: one(companies, {
    fields: [docTemplates.companyId],
    references: [companies.id],
  }),
  versions: many(docTemplateVersions),
  generatedDocuments: many(generatedDocuments),
}));

export const docTemplateVersionsRelations = relations(docTemplateVersions, ({ one }) => ({
  template: one(docTemplates, {
    fields: [docTemplateVersions.templateId],
    references: [docTemplates.id],
  }),
  createdBy: one(users, {
    fields: [docTemplateVersions.createdById],
    references: [users.id],
  }),
}));

export const generatedDocumentsRelations = relations(generatedDocuments, ({ one }) => ({
  company: one(companies, {
    fields: [generatedDocuments.companyId],
    references: [companies.id],
  }),
  object: one(objects, {
    fields: [generatedDocuments.objectId],
    references: [objects.id],
  }),
  template: one(docTemplates, {
    fields: [generatedDocuments.templateId],
    references: [docTemplates.id],
  }),
  generatedBy: one(users, {
    fields: [generatedDocuments.generatedById],
    references: [users.id],
  }),
}));

export const counterpartiesRelations = relations(counterparties, ({ one }) => ({
  company: one(companies, {
    fields: [counterparties.companyId],
    references: [companies.id],
  }),
}));
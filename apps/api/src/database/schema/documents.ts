import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { objects } from './objects';
import { users } from './users';

export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  objectId: uuid('object_id').notNull().references(() => objects.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  fileSize: integer('file_size').notNull(),
  storageKey: text('storage_key').notNull(),
  version: integer('version').default(1).notNull(),
  previousVersionId: uuid('previous_version_id'),
  uploadedById: uuid('uploaded_by_id').notNull().references(() => users.id),
  isLatest: boolean('is_latest').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const documentsRelations = relations(documents, ({ one }) => ({
  company: one(companies, {
    fields: [documents.companyId],
    references: [companies.id],
  }),
  object: one(objects, {
    fields: [documents.objectId],
    references: [objects.id],
  }),
  uploadedBy: one(users, {
    fields: [documents.uploadedById],
    references: [users.id],
  }),
  previousVersion: one(documents, {
    fields: [documents.previousVersionId],
    references: [documents.id],
  }),
}));
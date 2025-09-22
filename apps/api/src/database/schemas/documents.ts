import { pgTable, uuid, varchar, timestamp, integer, text, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { objects } from './objects';

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  objectId: uuid('object_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  fileKey: varchar('file_key', { length: 500 }).notNull(), // S3 key
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: integer('file_size').notNull(), // in bytes
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  version: integer('version').notNull().default(1),
  isLatest: boolean('is_latest').notNull().default(true),
  uploadedBy: uuid('uploaded_by').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const documentVersions = pgTable('document_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  documentId: uuid('document_id').notNull(),
  version: integer('version').notNull(),
  fileKey: varchar('file_key', { length: 500 }).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: integer('file_size').notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  uploadedBy: uuid('uploaded_by').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Relations will be added when we have user tables
export const documentsRelations = relations(documents, ({ one, many }) => ({
  object: one(objects, {
    fields: [documents.objectId],
    references: [objects.id],
  }),
  versions: many(documentVersions),
}));

export const documentVersionsRelations = relations(documentVersions, ({ one }) => ({
  document: one(documents, {
    fields: [documentVersions.documentId],
    references: [documents.id],
  }),
}));
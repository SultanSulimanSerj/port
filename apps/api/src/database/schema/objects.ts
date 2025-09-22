import { relations } from 'drizzle-orm';
import { boolean, date, integer, numeric, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { users } from './users';

export const objects = pgTable('objects', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).default('DRAFT').notNull(), // DRAFT, ACTIVE, ON_HOLD, COMPLETED, CANCELLED
  startDate: date('start_date'),
  endDate: date('end_date'),
  estimatedHours: integer('estimated_hours'),
  actualHours: integer('actual_hours').default(0),
  budget: numeric('budget', { precision: 15, scale: 2 }),
  currency: varchar('currency', { length: 3 }),
  location: text('location'),
  tags: text('tags'), // JSON array
  isArchived: boolean('is_archived').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const objectMembers = pgTable('object_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  objectId: uuid('object_id').notNull().references(() => objects.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 50 }).notNull(), // LEAD, ENGINEER, SUPERVISOR, VIEWER
  isResponsible: boolean('is_responsible').default(false).notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const objectsRelations = relations(objects, ({ one, many }) => ({
  company: one(companies, {
    fields: [objects.companyId],
    references: [companies.id],
  }),
  members: many(objectMembers),
}));

export const objectMembersRelations = relations(objectMembers, ({ one }) => ({
  object: one(objects, {
    fields: [objectMembers.objectId],
    references: [objects.id],
  }),
  user: one(users, {
    fields: [objectMembers.userId],
    references: [users.id],
  }),
}));
import { relations } from 'drizzle-orm';
import { boolean, date, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { objects } from './objects';
import { users } from './users';

export const approvalRequests = pgTable('approval_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  objectId: uuid('object_id').references(() => objects.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  contextType: varchar('context_type', { length: 50 }).notNull(), // DOCUMENT, CHANGE, OTHER
  contextId: uuid('context_id'),
  status: varchar('status', { length: 50 }).default('PENDING').notNull(), // PENDING, IN_PROGRESS, APPROVED, REJECTED, CANCELLED
  currentStep: integer('current_step').default(0).notNull(),
  dueDate: date('due_date'),
  completedAt: timestamp('completed_at'),
  createdById: uuid('created_by_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const approvalSteps = pgTable('approval_steps', {
  id: uuid('id').defaultRandom().primaryKey(),
  requestId: uuid('request_id').notNull().references(() => approvalRequests.id, { onDelete: 'cascade' }),
  index: integer('index').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  rule: varchar('rule', { length: 50 }).notNull(), // ALL, ANY, QUORUM
  quorumSize: integer('quorum_size'),
  dueDate: date('due_date'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const approvalAssignees = pgTable('approval_assignees', {
  id: uuid('id').defaultRandom().primaryKey(),
  stepId: uuid('step_id').notNull().references(() => approvalSteps.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),
  decision: varchar('decision', { length: 50 }).default('PENDING').notNull(), // PENDING, APPROVED, REJECTED
  decidedAt: timestamp('decided_at'),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const approvalPolicies = pgTable('approval_policies', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  contextType: varchar('context_type', { length: 50 }).notNull(),
  conditions: text('conditions'), // JSON
  steps: text('steps'), // JSON array
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const approvalEvents = pgTable('approval_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  requestId: uuid('request_id').notNull().references(() => approvalRequests.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  details: text('details'), // JSON
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const approvalRequestsRelations = relations(approvalRequests, ({ one, many }) => ({
  company: one(companies, {
    fields: [approvalRequests.companyId],
    references: [companies.id],
  }),
  object: one(objects, {
    fields: [approvalRequests.objectId],
    references: [objects.id],
  }),
  createdBy: one(users, {
    fields: [approvalRequests.createdById],
    references: [users.id],
  }),
  steps: many(approvalSteps),
  events: many(approvalEvents),
}));

export const approvalStepsRelations = relations(approvalSteps, ({ one, many }) => ({
  request: one(approvalRequests, {
    fields: [approvalSteps.requestId],
    references: [approvalRequests.id],
  }),
  assignees: many(approvalAssignees),
}));

export const approvalAssigneesRelations = relations(approvalAssignees, ({ one }) => ({
  step: one(approvalSteps, {
    fields: [approvalAssignees.stepId],
    references: [approvalSteps.id],
  }),
  user: one(users, {
    fields: [approvalAssignees.userId],
    references: [users.id],
  }),
}));

export const approvalPoliciesRelations = relations(approvalPolicies, ({ one }) => ({
  company: one(companies, {
    fields: [approvalPolicies.companyId],
    references: [companies.id],
  }),
}));

export const approvalEventsRelations = relations(approvalEvents, ({ one }) => ({
  request: one(approvalRequests, {
    fields: [approvalEvents.requestId],
    references: [approvalRequests.id],
  }),
  user: one(users, {
    fields: [approvalEvents.userId],
    references: [users.id],
  }),
}));
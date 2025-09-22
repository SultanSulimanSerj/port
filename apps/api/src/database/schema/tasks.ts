import { relations } from 'drizzle-orm';
import { boolean, date, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { objects } from './objects';
import { users } from './users';

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  objectId: uuid('object_id').notNull().references(() => objects.id, { onDelete: 'cascade' }),
  parentId: uuid('parent_id'),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).default('TODO').notNull(), // TODO, IN_PROGRESS, REVIEW, DONE
  priority: varchar('priority', { length: 50 }).default('MEDIUM').notNull(), // LOW, MEDIUM, HIGH, URGENT
  assigneeId: uuid('assignee_id').references(() => users.id),
  reporterId: uuid('reporter_id').notNull().references(() => users.id),
  estimatedHours: integer('estimated_hours'),
  actualHours: integer('actual_hours').default(0),
  startDate: date('start_date'),
  dueDate: date('due_date'),
  completedAt: timestamp('completed_at'),
  orderIndex: integer('order_index').default(0).notNull(),
  tags: text('tags'), // JSON array
  isArchived: boolean('is_archived').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const milestones = pgTable('milestones', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  objectId: uuid('object_id').notNull().references(() => objects.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  dueDate: date('due_date').notNull(),
  completedAt: timestamp('completed_at'),
  isCompleted: boolean('is_completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const scheduleItems = pgTable('schedule_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  objectId: uuid('object_id').notNull().references(() => objects.id, { onDelete: 'cascade' }),
  taskId: uuid('task_id').references(() => tasks.id),
  milestoneId: uuid('milestone_id').references(() => milestones.id),
  name: varchar('name', { length: 255 }).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  duration: integer('duration').notNull(), // in hours
  dependsOnIds: text('depends_on_ids'), // JSON array of UUIDs
  completedPercent: integer('completed_percent').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const tasksRelations = relations(tasks, ({ one, many }) => ({
  company: one(companies, {
    fields: [tasks.companyId],
    references: [companies.id],
  }),
  object: one(objects, {
    fields: [tasks.objectId],
    references: [objects.id],
  }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
  }),
  reporter: one(users, {
    fields: [tasks.reporterId],
    references: [users.id],
  }),
  parent: one(tasks, {
    fields: [tasks.parentId],
    references: [tasks.id],
  }),
  children: many(tasks),
}));

export const milestonesRelations = relations(milestones, ({ one }) => ({
  company: one(companies, {
    fields: [milestones.companyId],
    references: [companies.id],
  }),
  object: one(objects, {
    fields: [milestones.objectId],
    references: [objects.id],
  }),
}));

export const scheduleItemsRelations = relations(scheduleItems, ({ one }) => ({
  company: one(companies, {
    fields: [scheduleItems.companyId],
    references: [companies.id],
  }),
  object: one(objects, {
    fields: [scheduleItems.objectId],
    references: [objects.id],
  }),
  task: one(tasks, {
    fields: [scheduleItems.taskId],
    references: [tasks.id],
  }),
  milestone: one(milestones, {
    fields: [scheduleItems.milestoneId],
    references: [milestones.id],
  }),
}));
import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { objects } from './objects';
import { users } from './users';

export const chatThreads = pgTable('chat_threads', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  objectId: uuid('object_id').notNull().references(() => objects.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
  lastMessageAt: timestamp('last_message_at'),
  messageCount: integer('message_count').default(0).notNull(),
  createdById: uuid('created_by_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  threadId: uuid('thread_id').notNull().references(() => chatThreads.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id').notNull().references(() => users.id),
  text: text('text').notNull(),
  attachments: text('attachments'), // JSON array
  mentions: text('mentions'), // JSON array of user IDs
  replyToId: uuid('reply_to_id'),
  isEdited: boolean('is_edited').default(false).notNull(),
  editedAt: timestamp('edited_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const chatPresence = pgTable('chat_presence', {
  id: uuid('id').defaultRandom().primaryKey(),
  threadId: uuid('thread_id').notNull().references(() => chatThreads.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  lastSeenAt: timestamp('last_seen_at').notNull(),
  isTyping: boolean('is_typing').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const chatThreadsRelations = relations(chatThreads, ({ one, many }) => ({
  company: one(companies, {
    fields: [chatThreads.companyId],
    references: [companies.id],
  }),
  object: one(objects, {
    fields: [chatThreads.objectId],
    references: [objects.id],
  }),
  createdBy: one(users, {
    fields: [chatThreads.createdById],
    references: [users.id],
  }),
  messages: many(chatMessages),
  presence: many(chatPresence),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  thread: one(chatThreads, {
    fields: [chatMessages.threadId],
    references: [chatThreads.id],
  }),
  author: one(users, {
    fields: [chatMessages.authorId],
    references: [users.id],
  }),
  replyTo: one(chatMessages, {
    fields: [chatMessages.replyToId],
    references: [chatMessages.id],
  }),
}));

export const chatPresenceRelations = relations(chatPresence, ({ one }) => ({
  thread: one(chatThreads, {
    fields: [chatPresence.threadId],
    references: [chatThreads.id],
  }),
  user: one(users, {
    fields: [chatPresence.userId],
    references: [users.id],
  }),
}));
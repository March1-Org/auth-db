import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const verificationsTable = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

export type VerificationsRow = InferSelectModel<typeof verificationsTable>;
export type VerificationsInsert = InferInsertModel<typeof verificationsTable>;
export type VerificationsUpdate = Partial<VerificationsRow>;

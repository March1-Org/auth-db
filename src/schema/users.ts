import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp(),
  deletedAt: timestamp(),
});

export type UserRow = InferSelectModel<typeof usersTable>;
export type UserInsert = InferInsertModel<typeof usersTable>;
export type UserUpdate = Partial<Omit<UserRow, 'id'>>;

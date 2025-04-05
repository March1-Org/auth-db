import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export type UserRow = InferSelectModel<typeof usersTable>;
export type UserInsert = InferInsertModel<typeof usersTable>;
export type UserUpdate = Partial<Omit<UserRow, 'id'>>;

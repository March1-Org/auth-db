import { accountsTable } from 'schema/accounts';
import { sessionsTable } from 'schema/sessions';
import { usersTable } from 'schema/users';
import { verificationsTable } from 'schema/verifications';
import { spreads } from 'utils/spread';

export const authSchema = {
  users: usersTable,
  sessions: sessionsTable,
  verifications: verificationsTable,
  accounts: accountsTable,
};
export const { users, sessions, verifications, accounts } = authSchema;

export type AuthSchema = typeof authSchema;

export const authSchemaBodies = {
  insert: spreads(authSchema, 'insert'),
  select: spreads(authSchema, 'select'),
  update: spreads(authSchema, 'update'),
};

export type AuthSchemaBodies = typeof authSchemaBodies;

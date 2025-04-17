import { accountsTable } from 'schema/accounts';
import { sessionsTable } from 'schema/sessions';
import { usersTable } from 'schema/users';
import { verificationsTable } from 'schema/verifications';
import { spreads } from 'utils/spread';

export const schema = {
  users: usersTable,
  sessions: sessionsTable,
  verifications: verificationsTable,
  accounts: accountsTable,
};
export const { users, sessions, verifications, accounts } = schema;

export type Schema = typeof schema;

export const schemaBodies = {
  insert: spreads(schema, 'insert'),
  select: spreads(schema, 'select'),
  update: spreads(schema, 'update'),
};

export type SchemaBodies = typeof schemaBodies;

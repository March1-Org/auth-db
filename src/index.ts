import { usersTable } from 'schema/users';
import { spreads } from 'utils/spread';

export const schema = { users: usersTable };

export type Schema = typeof schema;

export const schemaBodies = {
  insert: spreads(schema, 'insert'),
  select: spreads(schema, 'select'),
  update: spreads(schema, 'update'),
};

export type SchemaBodies = typeof schemaBodies;

import { usersTable } from 'schema/users';
import { spreads } from 'utils/spread';

export { usersTable as users } from 'schema/users';

export const schema = { users: usersTable };

export type Schema = typeof schema;

export const schemaBodies = {
  insert: spreads(schema, 'insert'),
  select: spreads(schema, 'select'),
  update: spreads(schema, 'update'),
};

export type SchemaBodies = typeof schemaBodies;

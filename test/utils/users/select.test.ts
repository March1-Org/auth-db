import { beforeAll, describe, expect, it } from 'bun:test';
import type { DbType } from 'db';
import { schema } from 'index';

import { setup } from '../setup';

let db: DbType;

beforeAll(async () => {
  const setupVals = await setup();
  db = setupVals.db;

  await db.delete(schema.users);
});

describe('Select User Table', async () => {
  it('selects all users', async () => {
    const users = await db.select().from(schema.users);

    expect(users).toBeArray();
  });
});

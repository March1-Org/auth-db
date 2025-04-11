import { faker } from '@faker-js/faker';
import { beforeAll, beforeEach, describe, expect, it } from 'bun:test';
import type { DbType } from 'db';
import { eq } from 'drizzle-orm';
import { schema } from 'index';
import type { UserRow } from 'schema/users';

import { setup } from '../utils/setup';

let db: DbType;
let testUser: UserRow;

beforeAll(async () => {
  const setupVals = await setup();
  db = setupVals.db;
});
beforeEach(async () => {
  await db.delete(schema.users);
  const mockUser = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 99 }),
  };
  await db.insert(schema.users).values(mockUser);
  testUser = (await db.select().from(schema.users))[0];
});

describe('Delete User Table', async () => {
  it('should delete a user by ID', async () => {
    await db.delete(schema.users).where(eq(schema.users.id, testUser.id));
    const users = await db.select().from(schema.users);
    expect(users.some((u) => u.id === testUser.id)).toBeFalse();
  });

  it('should not fail when deleting a non-existent user', async () => {
    const nonExistentId = 9999;
    await db.delete(schema.users).where(eq(schema.users.id, nonExistentId));
    const users = await db.select().from(schema.users);
    expect(users.length).toBe(1);
  });
});

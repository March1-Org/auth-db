import { faker } from '@faker-js/faker';
import { beforeAll, beforeEach, describe, expect, it } from 'bun:test';
import type { DbType } from 'db';
import { eq } from 'drizzle-orm';
import { schema } from 'index';

import { setup } from '../utils/setup';

let db: DbType;

beforeAll(async () => {
  const setupVals = await setup();
  db = setupVals.db;

  await db.delete(schema.users);
});

beforeEach(async () => {
  await db.delete(schema.users);
});

describe('Insert User Table', async () => {
  it('should successfully insert a new user', async () => {
    const mockUser = {
      name: faker.person.fullName(),
      age: faker.number.int({ min: 18, max: 100 }),
      email: faker.internet.email(),
    };

    // Insert and get the returned user (PostgreSQL syntax)
    const [insertedUser] = await db
      .insert(schema.users)
      .values(mockUser)
      .returning();

    // Verify returned data matches input
    expect(insertedUser).toMatchObject(mockUser);
    expect(insertedUser.id).toBeDefined();

    // Verify database state
    const [dbUser] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, insertedUser.id));

    expect(dbUser).toEqual(insertedUser);
  });

  it('should fail when inserting with duplicate email', async () => {
    const email = faker.internet.email();
    const mockUser = {
      name: faker.person.fullName(),
      age: 25,
      email: email,
    };

    // First insert should succeed
    await db.insert(schema.users).values(mockUser);

    let error;

    try {
      await db.insert(schema.users).values({
        ...mockUser,
        name: 'Different Name',
      });
    } catch (e) {
      error = e;
    }

    expect((error as { detail: string }).detail).toBe(
      `Key (email)=(${email}) already exists.`
    );
  });
});

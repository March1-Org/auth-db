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
});

// Clean up before each test
beforeEach(async () => {
  await db.delete(schema.users);
});

describe('User Update Operations', () => {
  it('should successfully update a user', async () => {
    // 1. Insert test user
    const [user] = await db
      .insert(schema.users)
      .values({
        name: 'Original Name',
        age: 25,
        email: faker.internet.email(),
      })
      .returning();

    // 2. Update the user
    const updatedData = {
      name: 'Updated Name',
      age: 30,
    };
    const [updatedUser] = await db
      .update(schema.users)
      .set(updatedData)
      .where(eq(schema.users.id, user.id))
      .returning();

    // 3. Verify changes
    expect(updatedUser).toMatchObject({
      ...user,
      ...updatedData,
    });

    // 4. Verify database state
    const [dbUser] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, user.id));
    expect(dbUser).toEqual(updatedUser);
  });

  it('It should not update an id', async () => {
    // 1. Create two test users
    const email1 = faker.internet.email();

    const [user1] = await db
      .insert(schema.users)
      .values({
        name: 'User 1',
        age: 25,
        email: email1,
      })
      .returning();

    let error;

    try {
      await db.update(schema.users).set({
        ...user1,
        name: 'Different Name',
      });
    } catch (e) {
      error = e;
    }

    expect((error as { detail: string }).detail).toBe(
      'Column "id" is an identity column defined as GENERATED ALWAYS.'
    );
  });

  it('should not update email if it violates unique constraint', async () => {
    // 1. Create two test users
    const email1 = faker.internet.email();
    const email2 = faker.internet.email();

    const [user1] = await db
      .insert(schema.users)
      .values({
        name: 'User 1',
        age: 25,
        email: email1,
      })
      .returning();

    await db.insert(schema.users).values({
      name: 'User 2',
      age: 30,
      email: email2,
    });

    let error;

    try {
      await db
        .update(schema.users)
        .set({ email: email2 })
        .where(eq(schema.users.id, user1.id));
    } catch (e) {
      error = e;
    }

    expect((error as { detail: string }).detail).toBe(
      `Key (email)=(${email2}) already exists.`
    );
  });

  it('should update multiple fields correctly', async () => {
    const [user] = await db
      .insert(schema.users)
      .values({
        name: 'Test User',
        age: 25,
        email: faker.internet.email(),
      })
      .returning();

    const updatePayload = {
      name: 'New Name',
      age: 30,
      email: faker.internet.email(),
    };

    const [updatedUser] = await db
      .update(schema.users)
      .set(updatePayload)
      .where(eq(schema.users.id, user.id))
      .returning();

    expect(updatedUser).toMatchObject(updatePayload);
  });

  it('should not update non-existent user', async () => {
    const nonExistentId = 9999;
    const result = await db
      .update(schema.users)
      .set({ name: 'Should Not Update' })
      .where(eq(schema.users.id, nonExistentId))
      .execute();

    // Verify no rows were affected
    expect(result.rowCount).toBe(0);
  });
});

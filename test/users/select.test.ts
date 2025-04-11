import { faker } from '@faker-js/faker';
import { beforeAll, beforeEach, describe, expect, it } from 'bun:test';
import type { DbType } from 'db';
import { schema } from 'index';

import { setup } from '../utils/setup';

let db: DbType;

beforeAll(async () => {
  const setupVals = await setup();
  db = setupVals.db;
});

// Clean slate before each test
beforeEach(async () => {
  await db.delete(schema.users);
});

describe('User Selection', () => {
  it('should return empty array when no users exist', async () => {
    const users = await db.select().from(schema.users);

    expect(users).toBeArray();
    expect(users).toHaveLength(0);
  });

  it('should return all users when they exist', async () => {
    // Insert test data
    const testUsers = [
      {
        name: faker.person.fullName(),
        age: faker.number.int({ min: 18, max: 99 }),
        email: faker.internet.email(),
      },
      {
        name: faker.person.fullName(),
        age: faker.number.int({ min: 18, max: 99 }),
        email: faker.internet.email(),
      },
    ];

    await db.insert(schema.users).values(testUsers);

    // Verify selection
    const users = await db.select().from(schema.users);

    expect(users).toBeArray();
    expect(users).toHaveLength(2);
    expect(users[0]).toMatchObject({
      name: expect.any(String),
      age: expect.any(Number),
      email: expect.any(String),
      id: expect.any(Number),
    });
  });

  it('should return specific columns when specified', async () => {
    await db.insert(schema.users).values({
      name: 'Test User',
      age: 30,
      email: 'test@example.com',
    });

    const users = await db
      .select({
        name: schema.users.name,
        email: schema.users.email,
      })
      .from(schema.users);

    expect(users[0]).toEqual({
      name: 'Test User',
      email: 'test@example.com',
    });
    expect(users[0]).not.toHaveProperty('age');
    expect(users[0]).not.toHaveProperty('id');
  });
});

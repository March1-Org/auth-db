import { faker } from '@faker-js/faker';
import { beforeAll, beforeEach, describe, expect, it } from 'bun:test';
import type { DbType } from 'db';
import { authSchema } from 'index';

import { setup } from '../utils/setup';

let db: DbType;

beforeAll(async () => {
  const setupVals = await setup();
  db = setupVals.db;
});

// Clean slate before each test
beforeEach(async () => {
  await db.delete(authSchema.users);
});

describe('User Selection', () => {
  it('should return empty array when no users exist', async () => {
    const users = await db.select().from(authSchema.users);

    expect(users).toBeArray();
    expect(users).toHaveLength(0);
  });

  it('should return all users when they exist', async () => {
    // Insert test data
    const testUsers = [
      {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        emailVerified: faker.datatype.boolean(),
        image: faker.image.avatar(),
        createdAt: new Date(),
        updatedAt: new Date(),
        phoneNumber: faker.phone.number(),
        phoneNumberVerified: faker.datatype.boolean(),
      },
      {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        emailVerified: faker.datatype.boolean(),
        image: faker.image.avatar(),
        createdAt: new Date(),
        updatedAt: new Date(),
        phoneNumber: faker.phone.number(),
        phoneNumberVerified: faker.datatype.boolean(),
      },
    ];

    await db.insert(authSchema.users).values(testUsers);

    // Verify selection
    const users = await db.select().from(authSchema.users);

    expect(users).toBeArray();
    expect(users).toHaveLength(2);
  });

  it('should return specific columns when specified', async () => {
    // Insert a test user with specific data
    const testUser = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      emailVerified: faker.datatype.boolean(),
      image: faker.image.avatar(),
      createdAt: new Date(),
      updatedAt: new Date(),
      phoneNumber: faker.phone.number(),
      phoneNumberVerified: faker.datatype.boolean(),
    };

    await db.insert(authSchema.users).values(testUser);

    // Select only name and email columns
    const users = await db
      .select({
        name: authSchema.users.name,
        email: authSchema.users.email,
      })
      .from(authSchema.users);

    expect(users).toBeArray();
    expect(users).toHaveLength(1);
    expect(users[0]).toEqual({
      name: testUser.name,
      email: testUser.email,
    });
    expect(users[0]).not.toHaveProperty('id');
    expect(users[0]).not.toHaveProperty('image');
    expect(users[0]).not.toHaveProperty('emailVerified');
  });
});

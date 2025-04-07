import { getDb } from 'db';

export async function setup() {
  const db = await getDb();

  return { db };
}

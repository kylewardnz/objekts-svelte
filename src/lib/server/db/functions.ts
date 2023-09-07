import { eq } from 'drizzle-orm'
import { db } from '.'
import { users, type User, type InsertUser } from './schema'
import { findUserByCosmoNickname } from './statements'

/**
 * Find a user in the database by their Cosmo nickname.
 * @param nickname string
 * @returns Promise<User | undefined>
 */
export async function findUserByCosmo(nickname: string): Promise<User | undefined> {
  const rows = await findUserByCosmoNickname.execute({ nickname })
  return rows[0]
}

/**
 * Update a user in the database.
 * @param nickname string
 * @param data Partial<InsertUser>
 * @returns Promise<void>
 */
export async function updateUser(nickname: string, data: Partial<InsertUser>): Promise<void> {
  await db.update(users).set(data).where(eq(users.cosmoNickname, nickname))
}

/**
 * Insert a new user into the database if they don't already exist.
 * @param nickname string
 * @param address string
 * @returns Promise<void>
 */
export async function upsertUser(nickname: string, address: string): Promise<void> {
  await db.insert(users).ignore().values({
    cosmoNickname: nickname,
    polygonAddress: address
  })
}

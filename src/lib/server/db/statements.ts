import { eq, sql } from 'drizzle-orm'
import { db } from '.'
import { users } from './schema'

export const findUserByCosmoNickname = db
  .select()
  .from(users)
  .where(eq(users.cosmoNickname, sql.placeholder('nickname')))
  .limit(1)
  .prepare()

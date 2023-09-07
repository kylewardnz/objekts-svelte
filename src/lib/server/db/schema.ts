import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { boolean, mysqlTable, varchar } from 'drizzle-orm/mysql-core'

export const users = mysqlTable('users', {
  // cosmo nicknames must be unique, so we can use it as a primary key
  cosmoNickname: varchar('cosmo_nickname', { length: 32 }).primaryKey(),
  polygonAddress: varchar('polygon_address', { length: 255 }).notNull(),
  isPrivate: boolean('is_private').notNull().default(false)
})
export type User = InferSelectModel<typeof users>
export type InsertUser = InferInsertModel<typeof users>

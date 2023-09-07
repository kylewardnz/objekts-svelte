import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { boolean, index, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core'

export const users = mysqlTable(
  'users',
  {
    id: serial('id').primaryKey(),
    cosmoNickname: varchar('cosmo_nickname', { length: 32 }).notNull().unique(),
    polygonAddress: varchar('polygon_address', { length: 255 }).notNull(),
    isPrivate: boolean('is_private').notNull().default(false)
  },
  (table) => ({
    cosmoNicknameIdx: index('cosmo_nickname_idx').on(table.cosmoNickname)
  })
)
export type User = InferSelectModel<typeof users>
export type InsertUser = InferInsertModel<typeof users>

import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { boolean, index, mysqlTable, serial, uniqueIndex, varchar } from 'drizzle-orm/mysql-core'

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

export const objekts = mysqlTable(
  'objekts',
  {
    id: serial('id').primaryKey(),
    frontImage: varchar('front_image', { length: 255 }).notNull(),
    backImage: varchar('back_image', { length: 255 }).notNull(),
    className: varchar('class_name', { length: 32 }).notNull(),
    memberName: varchar('member_name', { length: 32 }).notNull(),
    season: varchar('season', { length: 32 }).notNull(),
    collection: varchar('collection', { length: 32 }).notNull(),
    type: varchar('type', { length: 32 }).notNull()
  },
  (table) => ({
    classNameIdx: index('objekts_class_name_idx').on(table.className),
    memberNameIdx: index('objekts_member_name_idx').on(table.memberName),
    seasonIdx: index('objekts_season_idx').on(table.season),
    collectionIdx: index('objekts_collection_idx').on(table.collection),
    objektIdx: uniqueIndex('objekt_idx').on(
      table.memberName,
      table.collection,
      table.className,
      table.season
    )
  })
)
export type Objekt = InferSelectModel<typeof objekts>
export type InsertObjekt = InferInsertModel<typeof objekts>

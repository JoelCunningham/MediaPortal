import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const apps = sqliteTable('apps', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  isWeb: integer('isWeb', {mode: 'boolean'}).notNull(),
  location: text('location').notNull().unique(),
  position: integer('position').notNull(),
});

import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const editorTable = sqliteTable('editors', {
  id: text('id')
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`), // SQLite-compatible UUID generator
  name: text('name').notNull(),
  description: text('description'),
  state: text('state').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
    () => new Date(),
  ),
});

export type InsertEditor = typeof editorTable.$inferInsert;
export type SelectEditor = typeof editorTable.$inferSelect;

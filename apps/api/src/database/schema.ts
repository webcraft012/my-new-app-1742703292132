import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const editorTable = sqliteTable('editors', {
  id: text('id')
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`), // SQLite-compatible UUID generator
  name: text('name').notNull(),
  description: text('description'),
  state: text('state').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).$onUpdate(
    () => new Date(),
  ),
});

export type InsertEditor = typeof editorTable.$inferInsert;
export type SelectEditor = typeof editorTable.$inferSelect;

export const applicationTable = sqliteTable('applications', {
  id: text('id')
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`), // SQLite-compatible UUID generator
  name: text('name').notNull(),
  repoUrl: text('repoUrl').notNull(),
  sandboxId: text('sandboxId'),
  description: text('description'),
  userId: text('userId').notNull(),
  previewUrl: text('previewUrl'),
  sandboxProvider: text('sandboxProvider').notNull(),
  metadata: text('metadata'),
  createdAt: integer('createdAt', { mode: 'timestamp' })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).$onUpdate(
    () => new Date(),
  ),
});

export type InsertApplication = typeof applicationTable.$inferInsert;
export type SelectApplication = typeof applicationTable.$inferSelect;

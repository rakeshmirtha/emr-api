import { pgTable, integer, varchar, boolean } from 'drizzle-orm/pg-core';

export const clinicians = pgTable('clinicians', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    code: varchar({ length: 255 }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    isDeleted: boolean("is_deleted").notNull().default(false),
});
import { pgTable, integer, varchar, boolean } from 'drizzle-orm/pg-core';

export const clinicians = pgTable('clinicians', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    code: varchar({ length: 255 }).notNull(),
    isActive: boolean().notNull().default(true),
    isDeleted: boolean().notNull().default(false),
});
import { pgTable, integer, varchar, boolean } from 'drizzle-orm/pg-core';

export const patients = pgTable('patients', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    isDeleted: boolean("is_deleted").notNull().default(false),
});

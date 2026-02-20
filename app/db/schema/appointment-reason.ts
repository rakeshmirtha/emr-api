import {integer, pgTable, varchar, text, boolean} from "drizzle-orm/pg-core"

export const appointmentReasonTable = pgTable("appointmentReason", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    description: text().notNull(),
    code: varchar({ length: 255 }).notNull(),
    isActive: boolean().notNull().default(true),
    isDeleted: boolean().notNull().default(false),
});
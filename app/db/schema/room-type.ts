import {integer, pgTable, varchar, text, boolean} from "drizzle-orm/pg-core"

export const roomTypeTable = pgTable("roomType", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    description: text().notNull(),
    isActive: boolean().notNull().default(true),
    isDeleted: boolean().notNull().default(false),
});
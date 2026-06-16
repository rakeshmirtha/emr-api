import {integer, pgTable, varchar, text, boolean} from "drizzle-orm/pg-core"

export const roomTypeTable = pgTable("room_type", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    description: text().notNull(),
    isActive: boolean("is_active").notNull().default(true),
    isDeleted: boolean("is_deleted").notNull().default(false),
});
import { integer, pgTable, varchar, text, boolean } from "drizzle-orm/pg-core";

export const rotaManagementTable = pgTable("rota_management", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    fromTime: varchar({ length: 255 }).notNull(),
    toTime: varchar({ length: 255 }).notNull(),
    isActive: boolean().notNull().default(true),
    isDeleted: boolean().notNull().default(false),
});
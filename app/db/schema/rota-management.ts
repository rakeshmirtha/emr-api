import { integer, pgTable, varchar, boolean, time } from "drizzle-orm/pg-core";

export const rotaManagementTable = pgTable("rota_management", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    fromTime: time("from_time").notNull(),
    toTime: time("to_time").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    isDeleted: boolean("is_deleted").notNull().default(false),
});
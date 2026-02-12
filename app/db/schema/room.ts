import { pgTable, varchar, text, boolean, integer } from "drizzle-orm/pg-core"
import { roomTypeTable } from "./room-type";

export const roomTable = pgTable("room", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name").notNull(),
    roomLocation: text("roomLocation").notNull(),
    roomTypeId: integer("roomTypeId").notNull().references(() => roomTypeTable.id),
    isActive: boolean("isActive").notNull().default(true),
    isDeleted: boolean("isDeleted").notNull().default(false),
});

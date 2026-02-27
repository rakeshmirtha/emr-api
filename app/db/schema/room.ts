import { pgTable, varchar, text, boolean, integer } from "drizzle-orm/pg-core"
import { roomTypeTable } from "./room-type";

export const roomTable = pgTable("room", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name").notNull(),
    roomLocation: text("room_location").notNull(),
    roomTypeId: integer("room_type_id").notNull().references(() => roomTypeTable.id),
    isActive: boolean("is_active").notNull().default(true),
    isDeleted: boolean("is_deleted").notNull().default(false),
});

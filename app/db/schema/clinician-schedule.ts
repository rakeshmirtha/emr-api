import { pgTable, integer, varchar } from "drizzle-orm/pg-core";
import { clinicians } from "./clinician";

export const clinicianScheduleTable = pgTable("clinician_schedule", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    clinicianId: integer("clinician_id").notNull().references(() => clinicians.id),
    slotInMinute: integer("slot_in_minute").notNull(),
    slotFromDate: varchar("slot_from_date", { length: 10 }).notNull(),
    slotToDate: varchar("slot_to_date", { length: 10 }).notNull(),
});

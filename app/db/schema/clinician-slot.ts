import { pgTable, integer, varchar, time } from "drizzle-orm/pg-core";
import { clinicianScheduleTable } from "./clinician-schedule";
import { rotaManagementTable } from "./rota-management";

export const clinicianSlotTable = pgTable("clinician_slot", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    scheduleId: integer("schedule_id").notNull().references(() => clinicianScheduleTable.id),
    rotaId: integer("rota_id").notNull().references(() => rotaManagementTable.id),
    clinicianSlotDate: varchar("clinician_slot_date", { length: 10 }).notNull(),
    clinicianSlotStartTime: time("clinician_slot_start_time").notNull(),
    clinicianSlotEndTime: time("clinician_slot_end_time").notNull(),
    slotStatus: varchar("slot_status", { length: 50 }).notNull().default("available"),
});

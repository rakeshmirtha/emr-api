import { db } from "@/app/db";
import { clinicianScheduleTable } from "@/app/db/schema/clinician-schedule";
import { clinicianSlotTable } from "@/app/db/schema/clinician-slot";
import { clinicians } from "@/app/db/schema/clinician";
import { rotaManagementTable } from "@/app/db/schema/rota-management";
import { eq, inArray } from "drizzle-orm";

async function getClinicianById(id: number) {
    const result = await db
        .select({ id: clinicians.id })
        .from(clinicians)
        .where(eq(clinicians.id, id))
        .limit(1);

    return result[0] || null;
}

async function getRotasByIds(ids: number[]) {
    return await db
        .select({
            id: rotaManagementTable.id,
            fromTime: rotaManagementTable.fromTime,
            toTime: rotaManagementTable.toTime,
            isActive: rotaManagementTable.isActive,
            isDeleted: rotaManagementTable.isDeleted,
        })
        .from(rotaManagementTable)
        .where(inArray(rotaManagementTable.id, ids));
}

async function createSchedule(data: {
    clinicianId: number;
    slotInMinute: number;
    slotFromDate: string;
    slotToDate: string;
}) {
    const [schedule] = await db
        .insert(clinicianScheduleTable)
        .values({
            clinicianId: data.clinicianId,
            slotInMinute: data.slotInMinute,
            slotFromDate: data.slotFromDate,
            slotToDate: data.slotToDate,
        })
        .returning({ id: clinicianScheduleTable.id });

    return schedule;
}

async function createSlots(slots: {
    scheduleId: number;
    rotaId: number;
    clinicianSlotDate: string;
    clinicianSlotStartTime: string;
    clinicianSlotEndTime: string;
}[]) {
    return await db
        .insert(clinicianSlotTable)
        .values(slots.map((s) => ({
            scheduleId: s.scheduleId,
            rotaId: s.rotaId,
            clinicianSlotDate: s.clinicianSlotDate,
            clinicianSlotStartTime: s.clinicianSlotStartTime,
            clinicianSlotEndTime: s.clinicianSlotEndTime,
            slotStatus: "available",
        })))
        .returning({
            id: clinicianSlotTable.id,
            clinicianSlotDate: clinicianSlotTable.clinicianSlotDate,
            clinicianSlotStartTime: clinicianSlotTable.clinicianSlotStartTime,
            clinicianSlotEndTime: clinicianSlotTable.clinicianSlotEndTime,
            slotStatus: clinicianSlotTable.slotStatus,
        });
}

export const clinicianScheduleRepository = {
    getClinicianById,
    getRotasByIds,
    createSchedule,
    createSlots,
};

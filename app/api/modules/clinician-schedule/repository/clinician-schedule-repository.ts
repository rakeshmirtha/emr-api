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

async function getClinicianSchedules({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
    const offset = (page - 1) * limit;

    const rows = await db
        .select({
            clinicianId: clinicians.id,
            clinicianName: clinicians.name,
            clinicianScheduleId: clinicianScheduleTable.id,
            slotFromDate: clinicianScheduleTable.slotFromDate,
            slotToDate: clinicianScheduleTable.slotToDate,
            slotInMinute: clinicianScheduleTable.slotInMinute,
            slotDate: clinicianSlotTable.clinicianSlotDate,
            rotaId: rotaManagementTable.id,
            rotaName: rotaManagementTable.name,
            rotaFromTime: rotaManagementTable.fromTime,
            rotaToTime: rotaManagementTable.toTime,
        })
        .from(clinicians)
        .innerJoin(clinicianScheduleTable, eq(clinicianScheduleTable.clinicianId, clinicians.id))
        .innerJoin(clinicianSlotTable, eq(clinicianSlotTable.scheduleId, clinicianScheduleTable.id))
        .innerJoin(rotaManagementTable, eq(rotaManagementTable.id, clinicianSlotTable.rotaId))
        .where(eq(clinicians.isDeleted, false))
        .limit(limit)
        .offset(offset);

    return rows;
}

async function getClinicianScheduleById(id: number) {
    const rows = await db
        .select({
            clinicianId: clinicians.id,
            clinicianName: clinicians.name,
            clinicianScheduleId: clinicianScheduleTable.id,
            slotFromDate: clinicianScheduleTable.slotFromDate,
            slotToDate: clinicianScheduleTable.slotToDate,
            slotInMinute: clinicianScheduleTable.slotInMinute,
            slotDate: clinicianSlotTable.clinicianSlotDate,
            rotaId: rotaManagementTable.id,
            rotaName: rotaManagementTable.name,
            rotaFromTime: rotaManagementTable.fromTime,
            rotaToTime: rotaManagementTable.toTime,
        })
        .from(clinicians)
        .innerJoin(clinicianScheduleTable, eq(clinicianScheduleTable.clinicianId, clinicians.id))
        .innerJoin(clinicianSlotTable, eq(clinicianSlotTable.scheduleId, clinicianScheduleTable.id))
        .innerJoin(rotaManagementTable, eq(rotaManagementTable.id, clinicianSlotTable.rotaId))
        .where(eq(clinicianScheduleTable.id, id));

    return rows;
}

export const clinicianScheduleRepository = {
    getClinicianById,
    getRotasByIds,
    createSchedule,
    createSlots,
    getClinicianSchedules,
    getClinicianScheduleById,
};

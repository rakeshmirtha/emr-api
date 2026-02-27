import { clinicianScheduleRepository } from "../repository/clinician-schedule-repository";
import { validateCreateClinicianSchedule } from "../validator/clinician-schedule-validator";
import { CommandResult } from "../../../utils/utils";
import { CreateClinicianScheduleResponse } from "../schemas/clinician-schedule-schema";

function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function parseDDMMYYYY(dateStr: string): Date {
    const [dd, mm, yyyy] = dateStr.split("-");
    return new Date(`${yyyy}-${mm}-${dd}`);
}

function formatDDMMYYYY(date: Date): string {
    const dd = String(date.getUTCDate()).padStart(2, "0");
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    const yyyy = date.getUTCFullYear();
    return `${dd}-${mm}-${yyyy}`;
}

function dateRange(from: string, to: string): string[] {
    const dates: string[] = [];
    const current = parseDDMMYYYY(from);
    const end = parseDDMMYYYY(to);

    while (current <= end) {
        dates.push(formatDDMMYYYY(current));
        current.setUTCDate(current.getUTCDate() + 1);
    }

    return dates;
}

export async function createClinicianScheduleCommand(
    payload: unknown
): Promise<CommandResult<CreateClinicianScheduleResponse>> {
    const validationResult = await validateCreateClinicianSchedule(payload);

    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    const { clinicianId, rotaIds, slotInMinute, slotFromDate, slotToDate } = validationResult.data;

    const rotas = await clinicianScheduleRepository.getRotasByIds(rotaIds);

    const schedule = await clinicianScheduleRepository.createSchedule({
        clinicianId,
        slotInMinute,
        slotFromDate,
        slotToDate,
    });

    const slotsToInsert: {
        scheduleId: number;
        rotaId: number;
        clinicianSlotDate: string;
        clinicianSlotStartTime: string;
        clinicianSlotEndTime: string;
    }[] = [];

    for (const date of dateRange(slotFromDate, slotToDate)) {
        for (const rota of rotas) {
            const fromMinutes = timeToMinutes(rota.fromTime);
            const toMinutes = timeToMinutes(rota.toTime);
            let cursor = fromMinutes;

            while (cursor + slotInMinute <= toMinutes) {
                slotsToInsert.push({
                    scheduleId: schedule.id,
                    rotaId: rota.id,
                    clinicianSlotDate: date,
                    clinicianSlotStartTime: minutesToTime(cursor),
                    clinicianSlotEndTime: minutesToTime(cursor + slotInMinute),
                });
                cursor += slotInMinute;
            }
        }
    }

    const insertedSlots = await clinicianScheduleRepository.createSlots(slotsToInsert);

    return {
        success: true,
        data: {
            clinicianScheduleId: schedule.id,
            clinicianSlots: insertedSlots.map((slot) => ({
                clinicianSlotId: slot.id,
                clinicianSlotDate: slot.clinicianSlotDate,
                clinicianSlotStartTime: slot.clinicianSlotStartTime,
                clinicianSlotEndTime: slot.clinicianSlotEndTime,
                slotStatus: slot.slotStatus,
            })),
        },
    };
}

import { clinicianScheduleRepository } from "../repository/clinician-schedule-repository";
import { GetClinicianScheduleResponse, ScheduleDetail, RotaDetail } from "../schemas/clinician-schedule-schema";

export async function getClinicianSchedulesQuery(
    { page, limit }: { page?: number; limit?: number } = {}
): Promise<GetClinicianScheduleResponse[]> {
    const rows = await clinicianScheduleRepository.getClinicianSchedules({ page, limit });

    const clinicianMap = new Map<
        number,
        {
            clinicianId: number;
            clinicianName: string;
            scheduleMap: Map<
                number,
                {
                    clinicianScheduleId: number;
                    slotInMinute: number;
                    dateRotaMap: Map<string, Map<number, RotaDetail>>;
                }
            >;
        }
    >();

    for (const row of rows) {
        if (!clinicianMap.has(row.clinicianId)) {
            clinicianMap.set(row.clinicianId, {
                clinicianId: row.clinicianId,
                clinicianName: row.clinicianName,
                scheduleMap: new Map(),
            });
        }
        const clinicianEntry = clinicianMap.get(row.clinicianId)!;

        if (!clinicianEntry.scheduleMap.has(row.clinicianScheduleId)) {
            clinicianEntry.scheduleMap.set(row.clinicianScheduleId, {
                clinicianScheduleId: row.clinicianScheduleId,
                slotInMinute: row.slotInMinute,
                dateRotaMap: new Map(),
            });
        }
        const scheduleEntry = clinicianEntry.scheduleMap.get(row.clinicianScheduleId)!;

        if (!scheduleEntry.dateRotaMap.has(row.slotDate)) {
            scheduleEntry.dateRotaMap.set(row.slotDate, new Map());
        }
        const rotaMap = scheduleEntry.dateRotaMap.get(row.slotDate)!;

        if (!rotaMap.has(row.rotaId)) {
            rotaMap.set(row.rotaId, {
                rotaId: row.rotaId,
                rotaName: row.rotaName,
                rotaTime: `${row.rotaFromTime} - ${row.rotaToTime}`,
            });
        }
    }

    const result: GetClinicianScheduleResponse[] = [];

    for (const clinicianEntry of clinicianMap.values()) {
        const scheduleDetails: ScheduleDetail[] = [];

        for (const scheduleEntry of clinicianEntry.scheduleMap.values()) {
            for (const [date, rotaMap] of scheduleEntry.dateRotaMap.entries()) {
                scheduleDetails.push({
                    clinicianScheduleId: scheduleEntry.clinicianScheduleId,
                    scheduleDate: date,
                    slotInMinute: String(scheduleEntry.slotInMinute),
                    rotaDetails: Array.from(rotaMap.values()),
                });
            }
        }

        result.push({
            clinicianId: clinicianEntry.clinicianId,
            clinicianName: clinicianEntry.clinicianName,
            scheduleDetails,
        });
    }

    return result;
}

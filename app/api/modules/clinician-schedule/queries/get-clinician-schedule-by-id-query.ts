import { clinicianScheduleRepository } from "../repository/clinician-schedule-repository";
import { GetClinicianScheduleByIdResponse, ScheduleDetail, RotaDetail } from "../schemas/clinician-schedule-schema";

export async function getClinicianScheduleByIdQuery(
    id: number
): Promise<GetClinicianScheduleByIdResponse | null> {
    const rows = await clinicianScheduleRepository.getClinicianScheduleById(id);

    if (rows.length === 0) {
        return null;
    }

    const firstRow = rows[0];

    const dateRotaMap = new Map<string, Map<number, RotaDetail>>();

    for (const row of rows) {
        if (!dateRotaMap.has(row.slotDate)) {
            dateRotaMap.set(row.slotDate, new Map());
        }
        const rotaMap = dateRotaMap.get(row.slotDate)!;

        if (!rotaMap.has(row.rotaId)) {
            rotaMap.set(row.rotaId, {
                rotaId: row.rotaId,
                rotaName: row.rotaName,
                rotaTime: `${row.rotaFromTime} - ${row.rotaToTime}`,
            });
        }
    }

    const scheduleDetails: ScheduleDetail[] = [];
    for (const [date, rotaMap] of dateRotaMap.entries()) {
        scheduleDetails.push({
            clinicianScheduleId: firstRow.clinicianScheduleId,
            scheduleDate: date,
            slotInMinute: String(firstRow.slotInMinute),
            rotaDetails: Array.from(rotaMap.values()),
        });
    }

    return {
        clinicianScheduleId: firstRow.clinicianScheduleId,
        clinicianId: firstRow.clinicianId,
        clinicianName: firstRow.clinicianName,
        slotFromDate: firstRow.slotFromDate,
        slotToDate: firstRow.slotToDate,
        slotInMinute: firstRow.slotInMinute,
        scheduleDetails,
    };
}

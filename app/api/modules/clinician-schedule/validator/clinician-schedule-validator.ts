import { createClinicianScheduleSchema, CreateClinicianScheduleInput } from "../schemas/clinician-schedule-schema";
import { ValidationResult } from "../../../utils/utils";
import { clinicianScheduleRepository } from "../repository/clinician-schedule-repository";

export async function validateCreateClinicianSchedule(payload: unknown): Promise<ValidationResult<CreateClinicianScheduleInput>> {
    const result = createClinicianScheduleSchema.safeParse(payload);

    if (!result.success) {
        const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
    }

    // Validate clinician exists
    const clinician = await clinicianScheduleRepository.getClinicianById(result.data.clinicianId);
    if (!clinician) {
        return { success: false, errors: [`clinicianId: Clinician with ID ${result.data.clinicianId} not found`] };
    }

    // Validate all rotas exist and are active
    const rotas = await clinicianScheduleRepository.getRotasByIds(result.data.rotaIds);
    const foundIds = new Set(rotas.map((r) => r.id));

    for (const rotaId of result.data.rotaIds) {
        if (!foundIds.has(rotaId)) {
            return { success: false, errors: [`rotaIds: Rota with ID ${rotaId} not found`] };
        }
    }

    const inactiveRota = rotas.find((r) => !r.isActive || r.isDeleted);
    if (inactiveRota) {
        return { success: false, errors: [`rotaIds: Rota with ID ${inactiveRota.id} is inactive or deleted`] };
    }

    return { success: true, data: result.data };
}

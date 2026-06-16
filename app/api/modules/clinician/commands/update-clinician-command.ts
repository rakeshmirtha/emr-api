import { clinicianRepository } from "../repository/clinician-repository";
import { validateUpdateClinician } from "../validator/clinician-validator";
import { CommandResult } from "../../../utils/utils";
import { Clinician } from "../schemas/clinician-schema";

export async function updateClinicianCommand(id: number, payload: unknown): Promise<CommandResult<Clinician>> {
    const validationResult = await validateUpdateClinician(id, payload);

    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    const updated = await clinicianRepository.updateClinician(id, validationResult.data);

    return { success: true, data: updated };
}

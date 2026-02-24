import { clinicianRepository } from "../repository/clinician-repository";
import { validateCreateClinician } from "../validator/clinician-validator";
import { CommandResult } from "../../../utils/utils";
import { Clinician } from "../schemas/clinician-schema";

export async function createClinicianCommand(payload: unknown): Promise<CommandResult<Clinician>> {
    const validationResult = await validateCreateClinician(payload);

    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    const created = await clinicianRepository.createClinician(validationResult.data);

    return { success: true, data: created };
}

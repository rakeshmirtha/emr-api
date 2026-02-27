import { patientRepository } from "../repository/patient-repository";
import { validateCreatePatient } from "../validator/patient-validator";
import { CommandResult } from "../../../utils/utils";
import { Patient } from "../schemas/patient-schema";

export async function createPatientCommand(payload: unknown): Promise<CommandResult<Patient>> {
    const validationResult = await validateCreatePatient(payload);

    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    const created = await patientRepository.createPatient(validationResult.data);

    return { success: true, data: created };
}

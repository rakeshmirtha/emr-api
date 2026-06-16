import { patientRepository } from "../repository/patient-repository";
import { validateUpdatePatient } from "../validator/patient-validator";
import { CommandResult } from "../../../utils/utils";
import { Patient } from "../schemas/patient-schema";

export async function updatePatientCommand(id: number, payload: unknown): Promise<CommandResult<Patient>> {
    const validationResult = await validateUpdatePatient(id, payload);

    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    const updated = await patientRepository.updatePatient(id, validationResult.data);

    return { success: true, data: updated };
}

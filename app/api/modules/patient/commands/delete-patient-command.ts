import { patientRepository } from "../repository/patient-repository";
import { CommandResult } from "../../../utils/utils";

export async function deletePatientCommand(id: number): Promise<CommandResult> {
    await patientRepository.deletePatient(id);

    return { success: true, data: undefined };
}

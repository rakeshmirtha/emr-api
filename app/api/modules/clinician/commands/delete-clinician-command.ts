import { clinicianRepository } from "../repository/clinician-repository";
import { CommandResult } from "../../../utils/utils";

export async function deleteClinicianCommand(id: number): Promise<CommandResult> {
    await clinicianRepository.deleteClinician(id);

    return { success: true, data: undefined };
}

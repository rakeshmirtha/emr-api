import { appointmentModeRepository } from "../repository/appointment-mode-repository";
import { CommandResult } from "../../../utils/utils";

export async function deleteAppointmentModeCommand(id: number): Promise<CommandResult<void>> {
    // Basic delete logic without inUse check for now.
    await appointmentModeRepository.deleteAppointmentMode(id);
    return { success: true, data: undefined };
}

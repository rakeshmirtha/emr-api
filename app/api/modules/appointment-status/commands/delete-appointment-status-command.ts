import { appointmentStatusRepository } from "../repository/appointment-status-repository";
import { CommandResult } from "../../../utils/utils";

export async function deleteAppointmentStatusCommand(id: number): Promise<CommandResult<void>> {
    // Basic delete logic without inUse check for now.
    await appointmentStatusRepository.deleteAppointmentStatus(id);
    return { success: true, data: undefined };
}

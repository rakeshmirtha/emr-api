import { appointmentReasonRepository } from "../repository/appointment-reason-repository";
import { CommandResult } from "../../../utils/utils";

export async function deleteAppointmentReasonCommand(id: number): Promise<CommandResult<void>> {
    // Basic delete logic without inUse check for now.
    await appointmentReasonRepository.deleteAppointmentReason(id);
    return { success: true, data: undefined };
}

import { appointmentTypeRepository } from "../repository/appointment-type-repository";
import { CommandResult } from "../../../utils/utils";

export async function deleteAppointmentTypeCommand(id: number): Promise<CommandResult<void>> {
    // Basic delete logic without inUse check for now.
    await appointmentTypeRepository.deleteAppointmentType(id);
    return { success: true, data: undefined };
}

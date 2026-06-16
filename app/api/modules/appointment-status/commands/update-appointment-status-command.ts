import { appointmentStatusRepository } from "../repository/appointment-status-repository";
import { validateUpdateAppointmentStatus } from "../validator/appointment-status-validator";
import { CommandResult } from "../../../utils/utils";
import { AppointmentStatus } from "../schemas/appointment-status-schema";

export async function updateAppointmentStatusCommand(id: number, payload: unknown): Promise<CommandResult<AppointmentStatus>> {
    const validationResult = await validateUpdateAppointmentStatus(id, payload);
    
    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    const updatedAppointmentStatus = await appointmentStatusRepository.updateAppointmentStatus(id, validationResult.data);
    
    return { success: true, data: updatedAppointmentStatus };
}

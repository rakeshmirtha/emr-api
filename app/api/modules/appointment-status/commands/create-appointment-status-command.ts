import { appointmentStatusRepository } from "../repository/appointment-status-repository";
import { validateCreateAppointmentStatus } from "../validator/appointment-status-validator";
import { CommandResult } from "../../../utils/utils";
import { AppointmentStatus } from "../schemas/appointment-status-schema";

export async function createAppointmentStatusCommand(payload: unknown): Promise<CommandResult<AppointmentStatus>> {
    const validationResult = await validateCreateAppointmentStatus(payload);
    
    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    const createdAppointmentStatus = await appointmentStatusRepository.createAppointmentStatus(validationResult.data);
    
    return { success: true, data: createdAppointmentStatus };
}

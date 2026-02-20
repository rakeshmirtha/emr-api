import { appointmentModeRepository } from "../repository/appointment-mode-repository";
import { validateCreateAppointmentMode } from "../validator/appointment-mode-validator";
import { CommandResult } from "../../../utils/utils";
import { AppointmentMode } from "../schemas/appointment-mode-schema";

export async function createAppointmentModeCommand(payload: unknown): Promise<CommandResult<AppointmentMode>> {
    const validationResult = await validateCreateAppointmentMode(payload);
    
    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    const createdAppointmentMode = await appointmentModeRepository.createAppointmentMode(validationResult.data);
    
    return { success: true, data: createdAppointmentMode };
}

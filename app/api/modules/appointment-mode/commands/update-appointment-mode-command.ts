import { appointmentModeRepository } from "../repository/appointment-mode-repository";
import { validateUpdateAppointmentMode } from "../validator/appointment-mode-validator";
import { CommandResult } from "../../../utils/utils";
import { AppointmentMode } from "../schemas/appointment-mode-schema";

export async function updateAppointmentModeCommand(id: number, payload: unknown): Promise<CommandResult<AppointmentMode>> {
    const validationResult = await validateUpdateAppointmentMode(id, payload);
    
    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    const updatedAppointmentMode = await appointmentModeRepository.updateAppointmentMode(id, validationResult.data);
    
    return { success: true, data: updatedAppointmentMode };
}

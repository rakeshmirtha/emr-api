import { appointmentReasonRepository } from "../repository/appointment-reason-repository";
import { validateUpdateAppointmentReason } from "../validator/appointment-reason-validator";
import { CommandResult } from "../../../utils/utils";
import { AppointmentReason } from "../schemas/appointment-reason-schema";

export async function updateAppointmentReasonCommand(id: number, payload: unknown): Promise<CommandResult<AppointmentReason>> {
    const validationResult = await validateUpdateAppointmentReason(id, payload);
    
    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    const updatedAppointmentReason = await appointmentReasonRepository.updateAppointmentReason(id, validationResult.data);
    
    return { success: true, data: updatedAppointmentReason };
}

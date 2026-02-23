import { appointmentReasonRepository } from "../repository/appointment-reason-repository";
import { validateCreateAppointmentReason } from "../validator/appointment-reason-validator";
import { CommandResult } from "../../../utils/utils";
import { AppointmentReason } from "../schemas/appointment-reason-schema";

export async function createAppointmentReasonCommand(payload: unknown): Promise<CommandResult<AppointmentReason>> {
    const validationResult = await validateCreateAppointmentReason(payload);
    
    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    const createdAppointmentReason = await appointmentReasonRepository.createAppointmentReason(validationResult.data);
    
    return { success: true, data: createdAppointmentReason };
}

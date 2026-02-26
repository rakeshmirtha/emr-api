import { appointmentTypeRepository } from "../repository/appointment-type-repository";
import { validateCreateAppointmentType } from "../validator/appointment-type-validator";
import { CommandResult } from "../../../utils/utils";
import { AppointmentType } from "../schemas/appointment-type-schema";

export async function createAppointmentTypeCommand(payload: unknown): Promise<CommandResult<AppointmentType>> {
    const validationResult = await validateCreateAppointmentType(payload);
    
    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    const createdAppointmentType = await appointmentTypeRepository.createAppointmentType(validationResult.data);
    
    return { success: true, data: createdAppointmentType };
}

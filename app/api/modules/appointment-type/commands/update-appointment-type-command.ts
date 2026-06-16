import { appointmentTypeRepository } from "../repository/appointment-type-repository";
import { validateUpdateAppointmentType } from "../validator/appointment-type-validator";
import { CommandResult } from "../../../utils/utils";
import { AppointmentType } from "../schemas/appointment-type-schema";

export async function updateAppointmentTypeCommand(id: number, payload: unknown): Promise<CommandResult<AppointmentType>> {
    const validationResult = await validateUpdateAppointmentType(id, payload);
    
    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    const updatedAppointmentType = await appointmentTypeRepository.updateAppointmentType(id, validationResult.data);
    
    return { success: true, data: updatedAppointmentType };
}

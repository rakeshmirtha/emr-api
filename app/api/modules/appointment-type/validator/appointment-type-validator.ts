import { createAppointmentTypeSchema, CreateAppointmentTypeInput, updateAppointmentTypeSchema, UpdateAppointmentTypeInput } from "../schemas/appointment-type-schema";
import { ValidationResult } from "../../../utils/utils";
import { appointmentTypeRepository } from "../repository/appointment-type-repository";

export async function validateCreateAppointmentType(payload: unknown): Promise<ValidationResult<CreateAppointmentTypeInput>> {
    const result = createAppointmentTypeSchema.safeParse(payload);
    
    if (!result.success) {
        const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
    }

    const { nameExists, codeExists } = await appointmentTypeRepository.checkAppointmentTypeExists(result.data.name, result.data.code);
    
    const errors: string[] = [];
    if (nameExists) errors.push("name: An appointment type with this name already exists");
    if (codeExists) errors.push("code: An appointment type with this code already exists");

    if (errors.length > 0) {
        return { success: false, errors };
    }

    return { success: true, data: result.data };
}

export async function validateUpdateAppointmentType(id: number, payload: unknown): Promise<ValidationResult<UpdateAppointmentTypeInput>> {
    const result = updateAppointmentTypeSchema.safeParse(payload);
    
    if (!result.success) {
        const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
    }

    if (result.data.name || result.data.code) {
        const { nameExists, codeExists } = await appointmentTypeRepository.checkAppointmentTypeExists(result.data.name, result.data.code, id);
        
        const errors: string[] = [];
        if (result.data.name && nameExists) errors.push("name: An appointment type with this name already exists");
        if (result.data.code && codeExists) errors.push("code: An appointment type with this code already exists");

        if (errors.length > 0) {
            return { success: false, errors };
        }
    }

    return { success: true, data: result.data };
}

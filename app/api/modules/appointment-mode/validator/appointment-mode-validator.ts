import { createAppointmentModeSchema, CreateAppointmentModeInput, updateAppointmentModeSchema, UpdateAppointmentModeInput } from "../schemas/appointment-mode-schema";
import { ValidationResult } from "../../../utils/utils";
import { appointmentModeRepository } from "../repository/appointment-mode-repository";

export async function validateCreateAppointmentMode(payload: unknown): Promise<ValidationResult<CreateAppointmentModeInput>> {
    const result = createAppointmentModeSchema.safeParse(payload);
    
    if (!result.success) {
        const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
    }

    const { nameExists, codeExists } = await appointmentModeRepository.checkAppointmentModeExists(result.data.name, result.data.code);
    
    const errors: string[] = [];
    if (nameExists) errors.push("name: An appointment mode with this name already exists");
    if (codeExists) errors.push("code: An appointment mode with this code already exists");

    if (errors.length > 0) {
        return { success: false, errors };
    }

    return { success: true, data: result.data };
}

export async function validateUpdateAppointmentMode(id: number, payload: unknown): Promise<ValidationResult<UpdateAppointmentModeInput>> {
    const result = updateAppointmentModeSchema.safeParse(payload);
    
    if (!result.success) {
        const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
    }

    if (result.data.name || result.data.code) {
        const { nameExists, codeExists } = await appointmentModeRepository.checkAppointmentModeExists(result.data.name, result.data.code, id);
        
        const errors: string[] = [];
        if (result.data.name && nameExists) errors.push("name: An appointment mode with this name already exists");
        if (result.data.code && codeExists) errors.push("code: An appointment mode with this code already exists");

        if (errors.length > 0) {
            return { success: false, errors };
        }
    }

    return { success: true, data: result.data };
}

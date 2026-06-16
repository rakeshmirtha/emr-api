import { createAppointmentStatusSchema, CreateAppointmentStatusInput, updateAppointmentStatusSchema, UpdateAppointmentStatusInput } from "../schemas/appointment-status-schema";
import { ValidationResult } from "../../../utils/utils";
import { appointmentStatusRepository } from "../repository/appointment-status-repository";

export async function validateCreateAppointmentStatus(payload: unknown): Promise<ValidationResult<CreateAppointmentStatusInput>> {
    const result = createAppointmentStatusSchema.safeParse(payload);
    
    if (!result.success) {
        const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
    }

    const { nameExists, codeExists } = await appointmentStatusRepository.checkAppointmentStatusExists(result.data.name, result.data.code);
    
    const errors: string[] = [];
    if (nameExists) errors.push("name: An appointment status with this name already exists");
    if (codeExists) errors.push("code: An appointment status with this code already exists");

    if (errors.length > 0) {
        return { success: false, errors };
    }

    return { success: true, data: result.data };
}

export async function validateUpdateAppointmentStatus(id: number, payload: unknown): Promise<ValidationResult<UpdateAppointmentStatusInput>> {
    const result = updateAppointmentStatusSchema.safeParse(payload);
    
    if (!result.success) {
        const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
    }

    if (result.data.name || result.data.code) {
        const { nameExists, codeExists } = await appointmentStatusRepository.checkAppointmentStatusExists(result.data.name, result.data.code, id);
        
        const errors: string[] = [];
        if (result.data.name && nameExists) errors.push("name: An appointment status with this name already exists");
        if (result.data.code && codeExists) errors.push("code: An appointment status with this code already exists");

        if (errors.length > 0) {
            return { success: false, errors };
        }
    }

    return { success: true, data: result.data };
}

import { createAppointmentReasonSchema, CreateAppointmentReasonInput, updateAppointmentReasonSchema, UpdateAppointmentReasonInput } from "../schemas/appointment-reason-schema";
import { ValidationResult } from "../../../utils/utils";
import { appointmentReasonRepository } from "../repository/appointment-reason-repository";

export async function validateCreateAppointmentReason(payload: unknown): Promise<ValidationResult<CreateAppointmentReasonInput>> {
    const result = createAppointmentReasonSchema.safeParse(payload);
    
    if (!result.success) {
        const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
    }

    const { nameExists, codeExists } = await appointmentReasonRepository.checkAppointmentReasonExists(result.data.name, result.data.code);
    
    const errors: string[] = [];
    if (nameExists) errors.push("name: An appointment reason with this name already exists");
    if (codeExists) errors.push("code: An appointment reason with this code already exists");

    if (errors.length > 0) {
        return { success: false, errors };
    }

    return { success: true, data: result.data };
}

export async function validateUpdateAppointmentReason(id: number, payload: unknown): Promise<ValidationResult<UpdateAppointmentReasonInput>> {
    const result = updateAppointmentReasonSchema.safeParse(payload);
    
    if (!result.success) {
        const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
    }

    if (result.data.name || result.data.code) {
        const { nameExists, codeExists } = await appointmentReasonRepository.checkAppointmentReasonExists(result.data.name, result.data.code, id);
        
        const errors: string[] = [];
        if (result.data.name && nameExists) errors.push("name: An appointment reason with this name already exists");
        if (result.data.code && codeExists) errors.push("code: An appointment reason with this code already exists");

        if (errors.length > 0) {
            return { success: false, errors };
        }
    }

    return { success: true, data: result.data };
}

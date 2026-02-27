import { createPatientSchema, CreatePatientInput, updatePatientSchema, UpdatePatientInput } from "../schemas/patient-schema";
import { ValidationResult } from "../../../utils/utils";

export async function validateCreatePatient(payload: unknown): Promise<ValidationResult<CreatePatientInput>> {
    const result = createPatientSchema.safeParse(payload);

    if (!result.success) {
        const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
    }

    return { success: true, data: result.data };
}

export async function validateUpdatePatient(id: number, payload: unknown): Promise<ValidationResult<UpdatePatientInput>> {
    const result = updatePatientSchema.safeParse(payload);

    if (!result.success) {
        const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
    }

    return { success: true, data: result.data };
}

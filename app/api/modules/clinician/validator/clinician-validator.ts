import { createClinicianSchema, CreateClinicianInput, updateClinicianSchema, UpdateClinicianInput } from "../schemas/clinician-schema";
import { ValidationResult } from "../../../utils/utils";

export async function validateCreateClinician(payload: unknown): Promise<ValidationResult<CreateClinicianInput>> {
    const result = createClinicianSchema.safeParse(payload);

    if (!result.success) {
        const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
    }

    return { success: true, data: result.data };
}

export async function validateUpdateClinician(id: number, payload: unknown): Promise<ValidationResult<UpdateClinicianInput>> {
    const result = updateClinicianSchema.safeParse(payload);

    if (!result.success) {
        const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
    }

    return { success: true, data: result.data };
}

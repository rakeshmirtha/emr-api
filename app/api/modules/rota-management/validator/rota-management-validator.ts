import { createRotaManagementSchema, CreateRotaManagementInput, updateRotaManagementSchema, UpdateRotaManagementInput } from "../schemas/rota-management-schema";
import { ValidationResult } from "../../../utils/utils";
import { rotaManagementRepository } from "../repository/rota-management-repository";

export async function validateCreateRotaManagement(payload: unknown): Promise<ValidationResult<CreateRotaManagementInput>> {
    const result = createRotaManagementSchema.safeParse(payload);

    if (!result.success) {
        const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
    }

    const nameExists = await rotaManagementRepository.checkRotaManagementNameExists(result.data.name);
    if (nameExists) {
        return { success: false, errors: ["name: A rota management with this name already exists"] };
    }

    return { success: true, data: result.data };
}

export async function validateUpdateRotaManagement(id: number, payload: unknown): Promise<ValidationResult<UpdateRotaManagementInput>> {
    const result = updateRotaManagementSchema.safeParse(payload);

    if (!result.success) {
        const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
    }

    if (result.data.name) {
        const nameExists = await rotaManagementRepository.checkRotaManagementNameExists(result.data.name, id);
        if (nameExists) {
            return { success: false, errors: ["name: A rota management with this name already exists"] };
        }
    }

    return { success: true, data: result.data };
}

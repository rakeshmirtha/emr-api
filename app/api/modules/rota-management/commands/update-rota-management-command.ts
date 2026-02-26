import { rotaManagementRepository } from "../repository/rota-management-repository";
import { validateUpdateRotaManagement } from "../validator/rota-management-validator";
import { CommandResult } from "../../../utils/utils";
import { RotaManagement } from "../schemas/rota-management-schema";

export async function updateRotaManagementCommand(id: number, payload: unknown): Promise<CommandResult<RotaManagement>> {
    const validationResult = await validateUpdateRotaManagement(id, payload);

    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    const updated = await rotaManagementRepository.updateRotaManagement(id, validationResult.data);

    return { success: true, data: updated };
}

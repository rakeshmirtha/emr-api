import { rotaManagementRepository } from "../repository/rota-management-repository";
import { validateCreateRotaManagement } from "../validator/rota-management-validator";
import { CommandResult } from "../../../utils/utils";
import { RotaManagement } from "../schemas/rota-management-schema";

export async function createRotaManagementCommand(payload: unknown): Promise<CommandResult<RotaManagement>> {
    const validationResult = await validateCreateRotaManagement(payload);

    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    const created = await rotaManagementRepository.createRotaManagement(validationResult.data);

    return { success: true, data: created };
}

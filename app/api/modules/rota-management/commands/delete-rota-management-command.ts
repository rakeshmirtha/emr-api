import { rotaManagementRepository } from "../repository/rota-management-repository";
import { CommandResult } from "../../../utils/utils";

export async function deleteRotaManagementCommand(id: number): Promise<CommandResult> {
    await rotaManagementRepository.deleteRotaManagement(id);

    return { success: true, data: undefined };
}

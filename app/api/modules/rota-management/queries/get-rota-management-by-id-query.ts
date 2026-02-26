import { rotaManagementRepository } from "../repository/rota-management-repository";

export async function getRotaManagementByIdQuery(id: number) {
    return await rotaManagementRepository.getRotaManagementById(id);
}

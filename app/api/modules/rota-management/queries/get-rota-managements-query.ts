import { rotaManagementRepository } from "../repository/rota-management-repository";

export async function getRotaManagementsQuery({ page, limit }: { page?: number; limit?: number } = {}) {
    return await rotaManagementRepository.getRotaManagements({ page, limit });
}

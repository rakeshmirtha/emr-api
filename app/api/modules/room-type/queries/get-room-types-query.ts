import { roomTypeRepository } from "../repository/room-type-repository";

export async function getRoomTypesQuery({ page, limit }: { page?: number; limit?: number } = {}) {
    return await roomTypeRepository.getRoomTypes({ page, limit });
}

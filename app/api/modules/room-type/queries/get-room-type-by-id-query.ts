import { roomTypeRepository } from "../repository/room-type-repository";

export async function getRoomTypeByIdQuery(id: number) {
    return await roomTypeRepository.getRoomTypeById(id);
}

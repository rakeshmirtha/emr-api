import { roomTypeRepository } from "../repository/room-type-repository";

export async function getRoomTypesQuery() {
    return await roomTypeRepository.getRoomTypes();
}

import { roomRepository } from "../repository/room-repository";

export async function getRoomByIdQuery(id: number) {
    return await roomRepository.getRoomById(id);
}

import { roomRepository } from "../repository/room-repository";

export async function getRoomsQuery() {
    return await roomRepository.getRooms();
}

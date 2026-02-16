import { roomRepository } from "../repository/room-repository";
import { CommandResult } from "../../../utils/utils";

export async function deleteRoomCommand(id: number): Promise<CommandResult> {
    await roomRepository.deleteRoom(id);
    
    return { success: true, data: undefined };
}

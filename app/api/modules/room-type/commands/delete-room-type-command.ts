import { roomTypeRepository } from "../repository/room-type-repository";
import { CommandResult } from "../../../utils/utils";

export async function deleteRoomTypeCommand(id: number): Promise<CommandResult> {
    await roomTypeRepository.deleteRoomType(id);
    
    return { success: true, data: undefined };
}

import { roomTypeRepository } from "../repository/room-type-repository";
import { CommandResult } from "../../../utils/utils";

export async function deleteRoomTypeCommand(id: number): Promise<CommandResult> {
    const usageCheck = await roomTypeRepository.isRoomTypeInUse(id);
    
    if (usageCheck.inUse) {
        return {
            success: false,
            errors: [`Cannot delete room type. It is currently being used by ${usageCheck.count} room(s)`]
        };
    }
    
    await roomTypeRepository.deleteRoomType(id);
    
    return { success: true, data: undefined };
}

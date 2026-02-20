import { roomTypeRepository } from "../repository/room-type-repository";
import { validateUpdateRoomType } from "../validator/room-type-validator";
import { CommandResult } from "../../../utils/utils";
import { RoomType } from "../schemas/room-type-schema";

export async function updateRoomTypeCommand(id: number, payload: unknown): Promise<CommandResult<RoomType>> {
    const validationResult = await validateUpdateRoomType(id, payload);
    
    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    const updatedRoomType = await roomTypeRepository.updateRoomType(id, validationResult.data);
    
    return { success: true, data: updatedRoomType };
}

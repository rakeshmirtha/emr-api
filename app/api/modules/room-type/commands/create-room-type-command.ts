import { roomTypeRepository } from "../repository/room-type-repository";
import { validateCreateRoomType } from "../validator/room-type-validator";
import { CommandResult } from "../../../utils/utils";
import { RoomType } from "../schemas/room-type-schema";

export async function createRoomTypeCommand(payload: unknown): Promise<CommandResult<RoomType>> {
    const validationResult = validateCreateRoomType(payload);
    
    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    const createdRoomType = await roomTypeRepository.createRoomType(validationResult.data);
    
    return { success: true, data: createdRoomType };
}

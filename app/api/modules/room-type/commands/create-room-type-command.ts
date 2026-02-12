import { roomTypeRepository } from "../repository/room-type-repository";
import { validateCreateRoomType } from "../validator/room-type-validator";
import { CommandResult } from "../../../utils/utils";

export async function createRoomTypeCommand(payload: unknown): Promise<CommandResult> {
    const validationResult = validateCreateRoomType(payload);
    
    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    await roomTypeRepository.createRoomType(validationResult.data);
    
    return { success: true };
}

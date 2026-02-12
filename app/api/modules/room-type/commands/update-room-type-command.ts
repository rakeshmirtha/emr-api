import { roomTypeRepository } from "../repository/room-type-repository";
import { validateUpdateRoomType } from "../validator/room-type-validator";
import { CommandResult } from "../../../utils/utils";

export async function updateRoomTypeCommand(id: number, payload: unknown): Promise<CommandResult> {
    const validationResult = validateUpdateRoomType(payload);
    
    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    await roomTypeRepository.updateRoomType(id, validationResult.data);
    
    return { success: true };
}

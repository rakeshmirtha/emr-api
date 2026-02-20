import { roomRepository } from "../repository/room-repository";
import { validateCreateRoom } from "../validator/room-validator";

export async function createRoomCommand(payload: unknown) {
    const validationResult = await validateCreateRoom(payload);
    
    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    const createdRoom = await roomRepository.createRoom(validationResult.data);
    
    return { success: true, data: createdRoom };
}

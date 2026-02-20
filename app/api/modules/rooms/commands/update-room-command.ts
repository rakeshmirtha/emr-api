import { roomRepository } from "../repository/room-repository";
import { validateUpdateRoom } from "../validator/room-validator";

export async function updateRoomCommand(id: number, payload: unknown) {
    const validationResult = await validateUpdateRoom(id, payload);
    
    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    try {
        const updatedRoom = await roomRepository.updateRoom(id, validationResult.data);
        return { success: true, data: updatedRoom };
    } catch (error) {
        return { 
            success: false, 
            errors: [error instanceof Error ? error.message : "Failed to update room"] 
        };
    }
}

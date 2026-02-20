import { createRoomSchema, CreateRoomInput, updateRoomSchema, UpdateRoomInput } from "../schemas/room-schema";
import { ValidationResult } from "../../../utils/utils";
import { roomRepository } from "../repository/room-repository";

export async function validateCreateRoom(payload: unknown): Promise<ValidationResult<CreateRoomInput>> {
    const result = createRoomSchema.safeParse(payload);
    
    if (!result.success) {
        const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
    }

    // Check for duplicate name
    const nameExists = await roomRepository.checkRoomNameExists(result.data.name);
    if (nameExists) {
        return { success: false, errors: ["name: A room with this name already exists"] };
    }

    return { success: true, data: result.data };
}


export async function validateUpdateRoom(id: number, payload: unknown): Promise<ValidationResult<UpdateRoomInput>> {
    const result = updateRoomSchema.safeParse(payload);
    
    if (!result.success) {
        const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
    }

    // Check for duplicate name if name is being updated
    if (result.data.name) {
        const nameExists = await roomRepository.checkRoomNameExists(result.data.name, id);
        if (nameExists) {
            return { success: false, errors: ["name: A room with this name already exists"] };
        }
    }

    return { success: true, data: result.data };
}

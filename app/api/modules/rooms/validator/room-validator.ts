import { createRoomSchema, CreateRoomInput, updateRoomSchema, UpdateRoomInput } from "../schemas/room-schema";
import { ValidationResult } from "../../../utils/utils";

export function validateCreateRoom(payload: unknown): ValidationResult<CreateRoomInput> {
    const result = createRoomSchema.safeParse(payload);
    
    if (result.success) {
        return { success: true, data: result.data };
    }

    const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
    return { success: false, errors };
}

export function validateUpdateRoom(payload: unknown): ValidationResult<UpdateRoomInput> {
    const result = updateRoomSchema.safeParse(payload);
    
    if (result.success) {
        return { success: true, data: result.data };
    }

    const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
    return { success: false, errors };
}

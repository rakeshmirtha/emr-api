import { createRoomTypeSchema, CreateRoomTypeInput, updateRoomTypeSchema, UpdateRoomTypeInput } from "../schemas/room-type-schema";
import { ValidationResult } from "../../../utils/utils";

export function validateCreateRoomType(payload: unknown): ValidationResult<CreateRoomTypeInput> {
    const result = createRoomTypeSchema.safeParse(payload);
    
    if (result.success) {
        return { success: true, data: result.data };
    }

    const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
    return { success: false, errors };
}

export function validateUpdateRoomType(payload: unknown): ValidationResult<UpdateRoomTypeInput> {
    const result = updateRoomTypeSchema.safeParse(payload);
    
    if (result.success) {
        return { success: true, data: result.data };
    }

    const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
    return { success: false, errors };
}

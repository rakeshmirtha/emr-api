import { createRoomTypeSchema, CreateRoomTypeInput, updateRoomTypeSchema, UpdateRoomTypeInput } from "../schemas/room-type-schema";
import { ValidationResult } from "../../../utils/utils";
import { roomTypeRepository } from "../repository/room-type-repository";

export async function validateCreateRoomType(payload: unknown): Promise<ValidationResult<CreateRoomTypeInput>> {
    const result = createRoomTypeSchema.safeParse(payload);
    
    if (!result.success) {
        const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
    }

    // Check for duplicate name
    const nameExists = await roomTypeRepository.checkRoomTypeNameExists(result.data.name);
    if (nameExists) {
        return { success: false, errors: ["name: A room type with this name already exists"] };
    }

    return { success: true, data: result.data };
}


export async function validateUpdateRoomType(id: number, payload: unknown): Promise<ValidationResult<UpdateRoomTypeInput>> {
    const result = updateRoomTypeSchema.safeParse(payload);
    
    if (!result.success) {
        const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
    }

    // Check for duplicate name if name is being updated
    if (result.data.name) {
        const nameExists = await roomTypeRepository.checkRoomTypeNameExists(result.data.name, id);
        if (nameExists) {
            return { success: false, errors: ["name: A room type with this name already exists"] };
        }
    }

    return { success: true, data: result.data };
}

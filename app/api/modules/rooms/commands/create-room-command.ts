import { createRoomSchema, CreateRoomInput } from "../schemas/room-schema";
import { roomRepository } from "../repository/room-repository";

export type ValidationResult<T> = 
    | { success: true; data: T }
    | { success: false; errors: string[] };

export type CommandResult = 
    | { success: true }
    | { success: false; errors: string[] };

function validateCreateRoom(payload: unknown): ValidationResult<CreateRoomInput> {
    const result = createRoomSchema.safeParse(payload);
    
    if (result.success) {
        return { success: true, data: result.data };
    }

    const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
    return { success: false, errors };
}

export async function createRoomCommand(payload: unknown): Promise<CommandResult> {
    const validationResult = validateCreateRoom(payload);
    
    if (!validationResult.success) {
        return { success: false, errors: validationResult.errors };
    }

    await roomRepository.createRoom(validationResult.data);
    
    return { success: true };
}

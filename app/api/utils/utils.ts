export type ValidationResult<T> = 
    | { success: true; data: T }
    | { success: false; errors: string[] };

export type CommandResult = 
    | { success: true }
    | { success: false; errors: string[] };

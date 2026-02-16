import { z } from "zod";

export const createRoomSchema = z.object({
    name: z.string({ message: "Room name is required" }).min(1, "Room name cannot be empty"),
    roomTypeId: z.number({ message: "Room type ID must be a number" }),
    roomLocation: z.string().optional().default(""),
    isActive: z.boolean().optional().default(true),
    isDeleted: z.boolean().optional().default(false),
});

export const updateRoomSchema = z.object({
    name: z.string().min(1, "Room name cannot be empty").optional(),
    roomTypeId: z.number({ message: "Room type ID must be a number" }).optional(),
    roomLocation: z.string().optional(),
    isActive: z.boolean().optional(),
}).refine((data) => data.name !== undefined || data.roomTypeId !== undefined || data.roomLocation !== undefined || data.isActive !== undefined, {
    message: "At least one field must be provided for update",
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;

export type Room = {
    id: number;
    name: string;
    roomLocation: string;
    roomTypeId: number;
    isActive: boolean;
    isDeleted: boolean;
    roomType: {
        id: number;
        name: string;
        description: string;
        isActive: boolean;
        isDeleted: boolean;
    };
};


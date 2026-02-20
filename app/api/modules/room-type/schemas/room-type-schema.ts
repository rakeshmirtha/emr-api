import { z } from "zod";

export const createRoomTypeSchema = z.object({
    name: z.string({ message: "Room type name is required" }).min(1, "Room type name cannot be empty"),
    description: z.string({ message: "Room type description is required" }).min(1, "Room type description cannot be empty"),
    isActive: z.boolean().default(true),
});

export const updateRoomTypeSchema = z.object({
    name: z.string().min(1, "Room type name cannot be empty").optional(),
    description: z.string().min(1, "Room type description cannot be empty").optional(),
    isActive: z.boolean().optional(),
}).refine((data) => data.name !== undefined || data.description !== undefined || data.isActive !== undefined, {
    message: "At least one field must be provided for update",
});

export type CreateRoomTypeInput = z.infer<typeof createRoomTypeSchema>;
export type UpdateRoomTypeInput = z.infer<typeof updateRoomTypeSchema>;

export type RoomType = {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    isDeleted: boolean;
};


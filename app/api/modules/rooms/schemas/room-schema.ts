import { z } from "zod";

export const createRoomSchema = z.object({
    name: z.string({ message: "Room name is required" }).min(1, "Room name cannot be empty"),
    roomTypeId: z.number({ message: "Room type ID must be a number" }),
    roomLocation: z.string().optional().default(""),
    isActive: z.boolean().optional().default(true),
    isDeleted: z.boolean().optional().default(false),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;

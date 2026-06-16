import { z } from "zod";

export const createRotaManagementSchema = z.object({
    name: z.string({ message: "Rota name is required" }).min(1, "Rota name cannot be empty"),
    fromTime: z.string({ message: "From time is required" }).min(1, "From time cannot be empty"),
    toTime: z.string({ message: "To time is required" }).min(1, "To time cannot be empty"),
    isActive: z.boolean().default(true),
});

export const updateRotaManagementSchema = z.object({
    name: z.string().min(1, "Rota name cannot be empty").optional(),
    fromTime: z.string().min(1, "From time cannot be empty").optional(),
    toTime: z.string().min(1, "To time cannot be empty").optional(),
    isActive: z.boolean().optional(),
}).refine(
    (data) =>
        data.name !== undefined ||
        data.fromTime !== undefined ||
        data.toTime !== undefined ||
        data.isActive !== undefined,
    { message: "At least one field must be provided for update" }
);

export type CreateRotaManagementInput = z.infer<typeof createRotaManagementSchema>;
export type UpdateRotaManagementInput = z.infer<typeof updateRotaManagementSchema>;

export type RotaManagement = {
    id: number;
    name: string;
    fromTime: string;
    toTime: string;
    isActive: boolean;
    isDeleted: boolean;
};

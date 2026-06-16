import { z } from "zod";

export const createPatientSchema = z.object({
    name: z.string({ message: "Patient name is required" }).min(1, "Patient name cannot be empty"),
    isActive: z.boolean().default(true),
});

export const updatePatientSchema = z.object({
    name: z.string().min(1, "Patient name cannot be empty").optional(),
    isActive: z.boolean().optional(),
}).refine((data) => data.name !== undefined || data.isActive !== undefined, {
    message: "At least one field must be provided for update",
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;

export type Patient = {
    id: number;
    name: string;
    isActive: boolean;
    isDeleted: boolean;
};

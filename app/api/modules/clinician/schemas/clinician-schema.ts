import { z } from "zod";

export const createClinicianSchema = z.object({
    name: z.string({ message: "Clinician name is required" }).min(1, "Clinician name cannot be empty"),
    code: z.string({ message: "Clinician code is required" }).min(1, "Clinician code cannot be empty"),
    isActive: z.boolean().default(true),
});

export const updateClinicianSchema = z.object({
    name: z.string().min(1, "Clinician name cannot be empty").optional(),
    code: z.string().min(1, "Clinician code cannot be empty").optional(),
    isActive: z.boolean().optional(),
}).refine((data) => data.name !== undefined || data.code !== undefined || data.isActive !== undefined, {
    message: "At least one field must be provided for update",
});

export type CreateClinicianInput = z.infer<typeof createClinicianSchema>;
export type UpdateClinicianInput = z.infer<typeof updateClinicianSchema>;

export type Clinician = {
    id: number;
    name: string;
    code: string;
    isActive: boolean;
    isDeleted: boolean;
};

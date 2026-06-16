import { z } from "zod";

export const createAppointmentTypeSchema = z.object({
    name: z.string({ message: "Appointment type name is required" }).min(1, "Appointment type name cannot be empty"),
    description: z.string({ message: "Appointment type description is required" }).min(1, "Appointment type description cannot be empty"),
    code: z.string({ message: "Appointment type code is required" }).min(1, "Appointment type code cannot be empty"),
    isActive: z.boolean().default(true),
});

export const updateAppointmentTypeSchema = z.object({
    name: z.string().min(1, "Appointment type name cannot be empty").optional(),
    description: z.string().min(1, "Appointment type description cannot be empty").optional(),
    code: z.string().min(1, "Appointment type code cannot be empty").optional(),
    isActive: z.boolean().optional(),
}).refine((data) => data.name !== undefined || data.description !== undefined || data.code !== undefined || data.isActive !== undefined, {
    message: "At least one field must be provided for update",
});

export type CreateAppointmentTypeInput = z.infer<typeof createAppointmentTypeSchema>;
export type UpdateAppointmentTypeInput = z.infer<typeof updateAppointmentTypeSchema>;

export type AppointmentType = {
    id: number;
    name: string;
    description: string;
    code: string;
    isActive: boolean;
    isDeleted: boolean;
};

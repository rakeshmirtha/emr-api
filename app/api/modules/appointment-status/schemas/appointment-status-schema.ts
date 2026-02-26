import { z } from "zod";

export const createAppointmentStatusSchema = z.object({
    name: z.string({ message: "Appointment status name is required" }).min(1, "Appointment status name cannot be empty"),
    description: z.string({ message: "Appointment status description is required" }).min(1, "Appointment status description cannot be empty"),
    code: z.string({ message: "Appointment status code is required" }).min(1, "Appointment status code cannot be empty"),
    isActive: z.boolean().default(true),
});

export const updateAppointmentStatusSchema = z.object({
    name: z.string().min(1, "Appointment status name cannot be empty").optional(),
    description: z.string().min(1, "Appointment status description cannot be empty").optional(),
    code: z.string().min(1, "Appointment status code cannot be empty").optional(),
    isActive: z.boolean().optional(),
}).refine((data) => data.name !== undefined || data.description !== undefined || data.code !== undefined || data.isActive !== undefined, {
    message: "At least one field must be provided for update",
});

export type CreateAppointmentStatusInput = z.infer<typeof createAppointmentStatusSchema>;
export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;

export type AppointmentStatus = {
    id: number;
    name: string;
    description: string;
    code: string;
    isActive: boolean;
    isDeleted: boolean;
};

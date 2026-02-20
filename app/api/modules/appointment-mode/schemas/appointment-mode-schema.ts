import { z } from "zod";

export const createAppointmentModeSchema = z.object({
    name: z.string({ message: "Appointment mode name is required" }).min(1, "Appointment mode name cannot be empty"),
    description: z.string({ message: "Appointment mode description is required" }).min(1, "Appointment mode description cannot be empty"),
    code: z.string({ message: "Appointment mode code is required" }).min(1, "Appointment mode code cannot be empty"),
    isActive: z.boolean().default(true),
});

export const updateAppointmentModeSchema = z.object({
    name: z.string().min(1, "Appointment mode name cannot be empty").optional(),
    description: z.string().min(1, "Appointment mode description cannot be empty").optional(),
    code: z.string().min(1, "Appointment mode code cannot be empty").optional(),
    isActive: z.boolean().optional(),
}).refine((data) => data.name !== undefined || data.description !== undefined || data.code !== undefined || data.isActive !== undefined, {
    message: "At least one field must be provided for update",
});

export type CreateAppointmentModeInput = z.infer<typeof createAppointmentModeSchema>;
export type UpdateAppointmentModeInput = z.infer<typeof updateAppointmentModeSchema>;

export type AppointmentMode = {
    id: number;
    name: string;
    description: string;
    code: string;
    isActive: boolean;
    isDeleted: boolean;
};

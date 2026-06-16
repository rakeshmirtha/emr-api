import { z } from "zod";

export const createAppointmentReasonSchema = z.object({
    name: z.string({ message: "Appointment reason name is required" }).min(1, "Appointment reason name cannot be empty"),
    description: z.string({ message: "Appointment reason description is required" }).min(1, "Appointment reason description cannot be empty"),
    code: z.string({ message: "Appointment reason code is required" }).min(1, "Appointment reason code cannot be empty"),
    isActive: z.boolean().default(true),
});

export const updateAppointmentReasonSchema = z.object({
    name: z.string().min(1, "Appointment reason name cannot be empty").optional(),
    description: z.string().min(1, "Appointment reason description cannot be empty").optional(),
    code: z.string().min(1, "Appointment reason code cannot be empty").optional(),
    isActive: z.boolean().optional(),
}).refine((data) => data.name !== undefined || data.description !== undefined || data.code !== undefined || data.isActive !== undefined, {
    message: "At least one field must be provided for update",
});

export type CreateAppointmentReasonInput = z.infer<typeof createAppointmentReasonSchema>;
export type UpdateAppointmentReasonInput = z.infer<typeof updateAppointmentReasonSchema>;

export type AppointmentReason = {
    id: number;
    name: string;
    description: string;
    code: string;
    isActive: boolean;
    isDeleted: boolean;
};

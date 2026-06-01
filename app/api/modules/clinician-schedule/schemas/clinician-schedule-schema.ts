import { z } from "zod";

export const createClinicianScheduleSchema = z.object({
    clinicianId: z.number({ message: "Clinician ID is required" }).int().positive(),
    rotaIds: z
        .array(z.number().int().positive())
        .min(1, "At least one rota ID is required"),
    slotInMinute: z
        .number({ message: "Slot duration in minutes is required" })
        .int()
        .positive("Slot duration must be a positive integer"),
    slotFromDate: z
        .string({ message: "Slot from date is required" })
        .regex(/^\d{2}-\d{2}-\d{4}$/, "slotFromDate must be in DD-MM-YYYY format"),
    slotToDate: z
        .string({ message: "Slot to date is required" })
        .regex(/^\d{2}-\d{2}-\d{4}$/, "slotToDate must be in DD-MM-YYYY format"),
}).refine((data) => {
    const [fd, fm, fy] = data.slotFromDate.split("-").map(Number);
    const [td, tm, ty] = data.slotToDate.split("-").map(Number);
    const from = new Date(fy, fm - 1, fd);
    const to = new Date(ty, tm - 1, td);
    return to >= from;
}, {
    message: "slotToDate must be on or after slotFromDate",
    path: ["slotToDate"],
});

export type CreateClinicianScheduleInput = z.infer<typeof createClinicianScheduleSchema>;

export type ClinicianSlotResponse = {
    clinicianSlotId: number;
    clinicianSlotDate: string;
    clinicianSlotStartTime: string;
    clinicianSlotEndTime: string;
    slotStatus: string;
};

export type CreateClinicianScheduleResponse = {
    clinicianScheduleId: number;
    clinicianSlots: ClinicianSlotResponse[];
};

export type RotaDetail = {
    rotaId: number;
    rotaName: string;
    rotaTime: string;
};

export type ScheduleDetail = {
    clinicianScheduleId: number;
    scheduleDate: string;
    slotInMinute: string;
    rotaDetails: RotaDetail[];
};

export type GetClinicianScheduleResponse = {
    clinicianId: number;
    clinicianName: string;
    scheduleDetails: ScheduleDetail[];
};

export type GetClinicianScheduleByIdResponse = {
    clinicianScheduleId: number;
    clinicianId: number;
    clinicianName: string;
    slotFromDate: string;
    slotToDate: string;
    slotInMinute: number;
    scheduleDetails: ScheduleDetail[];
};


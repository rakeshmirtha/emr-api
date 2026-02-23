import { db } from "@/app/db";
import { appointmentReasonTable } from "@/app/db/schema/appointment-reason";
import { CreateAppointmentReasonInput, UpdateAppointmentReasonInput } from "../schemas/appointment-reason-schema";
import { eq, count, or } from "drizzle-orm";

async function createAppointmentReason(data: CreateAppointmentReasonInput) {
    const [createdAppointmentReason] = await db.insert(appointmentReasonTable).values({
        name: data.name,
        description: data.description,
        code: data.code,
        isActive: data.isActive ?? true,
    }).returning({
        id: appointmentReasonTable.id,
        name: appointmentReasonTable.name,
        description: appointmentReasonTable.description,
        code: appointmentReasonTable.code,
        isActive: appointmentReasonTable.isActive,
        isDeleted: appointmentReasonTable.isDeleted,
    });
    
    return createdAppointmentReason;
}

async function getAppointmentReasons({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
    const offset = (page - 1) * limit;

    const [data, [{ total }]] = await Promise.all([
        db
            .select({
                id: appointmentReasonTable.id,
                name: appointmentReasonTable.name,
                description: appointmentReasonTable.description,
                code: appointmentReasonTable.code,
                isActive: appointmentReasonTable.isActive,
                isDeleted: appointmentReasonTable.isDeleted,
            })
            .from(appointmentReasonTable)
            .where(eq(appointmentReasonTable.isDeleted, false))
            .limit(limit)
            .offset(offset),
        db
            .select({ total: count() })
            .from(appointmentReasonTable)
            .where(eq(appointmentReasonTable.isDeleted, false)),
    ]);

    return { data, total };
}

async function getAppointmentReasonById(id: number) {
    const result = await db
        .select({
            id: appointmentReasonTable.id,
            name: appointmentReasonTable.name,
            description: appointmentReasonTable.description,
            code: appointmentReasonTable.code,
            isActive: appointmentReasonTable.isActive,
            isDeleted: appointmentReasonTable.isDeleted,
        })
        .from(appointmentReasonTable)
        .where(eq(appointmentReasonTable.id, id))
        .limit(1);
    
    if (result[0]?.isDeleted) {
        return null;
    }
    
    return result[0] || null;
}

async function updateAppointmentReason(id: number, data: UpdateAppointmentReasonInput) {
    const updateData: Partial<typeof appointmentReasonTable.$inferInsert> = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.code !== undefined) updateData.code = data.code;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const existing = await getAppointmentReasonById(id);
    if (!existing) {
        throw new Error("Appointment reason not found or has been deleted");
    }

    const [updatedAppointmentReason] = await db
        .update(appointmentReasonTable)
        .set(updateData)
        .where(eq(appointmentReasonTable.id, id))
        .returning({
            id: appointmentReasonTable.id,
            name: appointmentReasonTable.name,
            description: appointmentReasonTable.description,
            code: appointmentReasonTable.code,
            isActive: appointmentReasonTable.isActive,
            isDeleted: appointmentReasonTable.isDeleted,
        });
    
    return updatedAppointmentReason;
}

async function deleteAppointmentReason(id: number): Promise<void> {
    await db
        .update(appointmentReasonTable)
        .set({ isDeleted: true })
        .where(eq(appointmentReasonTable.id, id));
}

async function checkAppointmentReasonExists(name?: string, code?: string, excludeId?: number): Promise<{ nameExists: boolean; codeExists: boolean }> {
    const conditions = [];
    if (name) conditions.push(eq(appointmentReasonTable.name, name));
    if (code) conditions.push(eq(appointmentReasonTable.code, code));

    if (conditions.length === 0) {
        return { nameExists: false, codeExists: false };
    }

    const results = await db
        .select({ 
            id: appointmentReasonTable.id,
            name: appointmentReasonTable.name,
            code: appointmentReasonTable.code,
            isDeleted: appointmentReasonTable.isDeleted
        })
        .from(appointmentReasonTable)
        .where(or(...conditions));
    
    const activeResults = results.filter(r => !r.isDeleted && (excludeId === undefined || r.id !== excludeId));
    
    return {
        nameExists: name ? activeResults.some(r => r.name === name) : false,
        codeExists: code ? activeResults.some(r => r.code === code) : false
    };
}

export const appointmentReasonRepository = {
    createAppointmentReason,
    getAppointmentReasons,
    getAppointmentReasonById,
    updateAppointmentReason,
    deleteAppointmentReason,
    checkAppointmentReasonExists,
}

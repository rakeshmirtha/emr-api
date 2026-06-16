import { db } from "@/app/db";
import { appointmentStatusTable } from "@/app/db/schema/appointment-status";
import { CreateAppointmentStatusInput, UpdateAppointmentStatusInput } from "../schemas/appointment-status-schema";
import { eq, count, or } from "drizzle-orm";

async function createAppointmentStatus(data: CreateAppointmentStatusInput) {
    const [createdAppointmentStatus] = await db.insert(appointmentStatusTable).values({
        name: data.name,
        description: data.description,
        code: data.code,
        isActive: data.isActive ?? true,
    }).returning({
        id: appointmentStatusTable.id,
        name: appointmentStatusTable.name,
        description: appointmentStatusTable.description,
        code: appointmentStatusTable.code,
        isActive: appointmentStatusTable.isActive,
        isDeleted: appointmentStatusTable.isDeleted,
    });
    
    return createdAppointmentStatus;
}

async function getAppointmentStatuses({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
    const offset = (page - 1) * limit;

    const [data, [{ total }]] = await Promise.all([
        db
            .select({
                id: appointmentStatusTable.id,
                name: appointmentStatusTable.name,
                description: appointmentStatusTable.description,
                code: appointmentStatusTable.code,
                isActive: appointmentStatusTable.isActive,
                isDeleted: appointmentStatusTable.isDeleted,
            })
            .from(appointmentStatusTable)
            .where(eq(appointmentStatusTable.isDeleted, false))
            .limit(limit)
            .offset(offset),
        db
            .select({ total: count() })
            .from(appointmentStatusTable)
            .where(eq(appointmentStatusTable.isDeleted, false)),
    ]);

    return { data, total };
}

async function getAppointmentStatusById(id: number) {
    const result = await db
        .select({
            id: appointmentStatusTable.id,
            name: appointmentStatusTable.name,
            description: appointmentStatusTable.description,
            code: appointmentStatusTable.code,
            isActive: appointmentStatusTable.isActive,
            isDeleted: appointmentStatusTable.isDeleted,
        })
        .from(appointmentStatusTable)
        .where(eq(appointmentStatusTable.id, id))
        .limit(1);
    
    if (result[0]?.isDeleted) {
        return null;
    }
    
    return result[0] || null;
}

async function updateAppointmentStatus(id: number, data: UpdateAppointmentStatusInput) {
    const updateData: Partial<typeof appointmentStatusTable.$inferInsert> = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.code !== undefined) updateData.code = data.code;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const existing = await getAppointmentStatusById(id);
    if (!existing) {
        throw new Error("Appointment status not found or has been deleted");
    }

    const [updatedAppointmentStatus] = await db
        .update(appointmentStatusTable)
        .set(updateData)
        .where(eq(appointmentStatusTable.id, id))
        .returning({
            id: appointmentStatusTable.id,
            name: appointmentStatusTable.name,
            description: appointmentStatusTable.description,
            code: appointmentStatusTable.code,
            isActive: appointmentStatusTable.isActive,
            isDeleted: appointmentStatusTable.isDeleted,
        });
    
    return updatedAppointmentStatus;
}

async function deleteAppointmentStatus(id: number): Promise<void> {
    await db
        .update(appointmentStatusTable)
        .set({ isDeleted: true })
        .where(eq(appointmentStatusTable.id, id));
}

async function checkAppointmentStatusExists(name?: string, code?: string, excludeId?: number): Promise<{ nameExists: boolean; codeExists: boolean }> {
    const conditions = [];
    if (name) conditions.push(eq(appointmentStatusTable.name, name));
    if (code) conditions.push(eq(appointmentStatusTable.code, code));

    if (conditions.length === 0) {
        return { nameExists: false, codeExists: false };
    }

    const results = await db
        .select({ 
            id: appointmentStatusTable.id,
            name: appointmentStatusTable.name,
            code: appointmentStatusTable.code,
            isDeleted: appointmentStatusTable.isDeleted
        })
        .from(appointmentStatusTable)
        .where(or(...conditions));
    
    const activeResults = results.filter(r => !r.isDeleted && (excludeId === undefined || r.id !== excludeId));
    
    return {
        nameExists: name ? activeResults.some(r => r.name === name) : false,
        codeExists: code ? activeResults.some(r => r.code === code) : false
    };
}

export const appointmentStatusRepository = {
    createAppointmentStatus,
    getAppointmentStatuses,
    getAppointmentStatusById,
    updateAppointmentStatus,
    deleteAppointmentStatus,
    checkAppointmentStatusExists,
}

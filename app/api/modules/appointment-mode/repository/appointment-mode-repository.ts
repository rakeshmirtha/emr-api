import { db } from "@/app/db";
import { appointmentModeTable } from "@/app/db/schema/appointment-mode";
import { CreateAppointmentModeInput, UpdateAppointmentModeInput } from "../schemas/appointment-mode-schema";
import { eq, count, or } from "drizzle-orm";

async function createAppointmentMode(data: CreateAppointmentModeInput) {
    const [createdAppointmentMode] = await db.insert(appointmentModeTable).values({
        name: data.name,
        description: data.description,
        code: data.code,
        isActive: data.isActive ?? true,
    }).returning({
        id: appointmentModeTable.id,
        name: appointmentModeTable.name,
        description: appointmentModeTable.description,
        code: appointmentModeTable.code,
        isActive: appointmentModeTable.isActive,
        isDeleted: appointmentModeTable.isDeleted,
    });
    
    return createdAppointmentMode;
}

async function getAppointmentModes({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
    const offset = (page - 1) * limit;

    const [data, [{ total }]] = await Promise.all([
        db
            .select({
                id: appointmentModeTable.id,
                name: appointmentModeTable.name,
                description: appointmentModeTable.description,
                code: appointmentModeTable.code,
                isActive: appointmentModeTable.isActive,
                isDeleted: appointmentModeTable.isDeleted,
            })
            .from(appointmentModeTable)
            .where(eq(appointmentModeTable.isDeleted, false))
            .limit(limit)
            .offset(offset),
        db
            .select({ total: count() })
            .from(appointmentModeTable)
            .where(eq(appointmentModeTable.isDeleted, false)),
    ]);

    return { data, total };
}

async function getAppointmentModeById(id: number) {
    const result = await db
        .select({
            id: appointmentModeTable.id,
            name: appointmentModeTable.name,
            description: appointmentModeTable.description,
            code: appointmentModeTable.code,
            isActive: appointmentModeTable.isActive,
            isDeleted: appointmentModeTable.isDeleted,
        })
        .from(appointmentModeTable)
        .where(eq(appointmentModeTable.id, id))
        .limit(1);
    
    if (result[0]?.isDeleted) {
        return null;
    }
    
    return result[0] || null;
}

async function updateAppointmentMode(id: number, data: UpdateAppointmentModeInput) {
    const updateData: Partial<typeof appointmentModeTable.$inferInsert> = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.code !== undefined) updateData.code = data.code;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const existing = await getAppointmentModeById(id);
    if (!existing) {
        throw new Error("Appointment mode not found or has been deleted");
    }

    const [updatedAppointmentMode] = await db
        .update(appointmentModeTable)
        .set(updateData)
        .where(eq(appointmentModeTable.id, id))
        .returning({
            id: appointmentModeTable.id,
            name: appointmentModeTable.name,
            description: appointmentModeTable.description,
            code: appointmentModeTable.code,
            isActive: appointmentModeTable.isActive,
            isDeleted: appointmentModeTable.isDeleted,
        });
    
    return updatedAppointmentMode;
}

async function deleteAppointmentMode(id: number): Promise<void> {
    await db
        .update(appointmentModeTable)
        .set({ isDeleted: true })
        .where(eq(appointmentModeTable.id, id));
}

async function checkAppointmentModeExists(name?: string, code?: string, excludeId?: number): Promise<{ nameExists: boolean; codeExists: boolean }> {
    const conditions = [];
    if (name) conditions.push(eq(appointmentModeTable.name, name));
    if (code) conditions.push(eq(appointmentModeTable.code, code));

    if (conditions.length === 0) {
        return { nameExists: false, codeExists: false };
    }

    const results = await db
        .select({ 
            id: appointmentModeTable.id,
            name: appointmentModeTable.name,
            code: appointmentModeTable.code,
            isDeleted: appointmentModeTable.isDeleted
        })
        .from(appointmentModeTable)
        .where(or(...conditions));
    
    const activeResults = results.filter(r => !r.isDeleted && (excludeId === undefined || r.id !== excludeId));
    
    return {
        nameExists: name ? activeResults.some(r => r.name === name) : false,
        codeExists: code ? activeResults.some(r => r.code === code) : false
    };
}

export const appointmentModeRepository = {
    createAppointmentMode,
    getAppointmentModes,
    getAppointmentModeById,
    updateAppointmentMode,
    deleteAppointmentMode,
    checkAppointmentModeExists,
}

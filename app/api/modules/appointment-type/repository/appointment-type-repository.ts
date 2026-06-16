import { db } from "@/app/db";
import { appointmentTypeTable } from "@/app/db/schema/appointment-type";
import { CreateAppointmentTypeInput, UpdateAppointmentTypeInput } from "../schemas/appointment-type-schema";
import { eq, count, or } from "drizzle-orm";

async function createAppointmentType(data: CreateAppointmentTypeInput) {
    const [createdAppointmentType] = await db.insert(appointmentTypeTable).values({
        name: data.name,
        description: data.description,
        code: data.code,
        isActive: data.isActive ?? true,
    }).returning({
        id: appointmentTypeTable.id,
        name: appointmentTypeTable.name,
        description: appointmentTypeTable.description,
        code: appointmentTypeTable.code,
        isActive: appointmentTypeTable.isActive,
        isDeleted: appointmentTypeTable.isDeleted,
    });
    
    return createdAppointmentType;
}

async function getAppointmentTypes({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
    const offset = (page - 1) * limit;

    const [data, [{ total }]] = await Promise.all([
        db
            .select({
                id: appointmentTypeTable.id,
                name: appointmentTypeTable.name,
                description: appointmentTypeTable.description,
                code: appointmentTypeTable.code,
                isActive: appointmentTypeTable.isActive,
                isDeleted: appointmentTypeTable.isDeleted,
            })
            .from(appointmentTypeTable)
            .where(eq(appointmentTypeTable.isDeleted, false))
            .limit(limit)
            .offset(offset),
        db
            .select({ total: count() })
            .from(appointmentTypeTable)
            .where(eq(appointmentTypeTable.isDeleted, false)),
    ]);

    return { data, total };
}

async function getAppointmentTypeById(id: number) {
    const result = await db
        .select({
            id: appointmentTypeTable.id,
            name: appointmentTypeTable.name,
            description: appointmentTypeTable.description,
            code: appointmentTypeTable.code,
            isActive: appointmentTypeTable.isActive,
            isDeleted: appointmentTypeTable.isDeleted,
        })
        .from(appointmentTypeTable)
        .where(eq(appointmentTypeTable.id, id))
        .limit(1);
    
    if (result[0]?.isDeleted) {
        return null;
    }
    
    return result[0] || null;
}

async function updateAppointmentType(id: number, data: UpdateAppointmentTypeInput) {
    const updateData: Partial<typeof appointmentTypeTable.$inferInsert> = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.code !== undefined) updateData.code = data.code;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const existing = await getAppointmentTypeById(id);
    if (!existing) {
        throw new Error("Appointment type not found or has been deleted");
    }

    const [updatedAppointmentType] = await db
        .update(appointmentTypeTable)
        .set(updateData)
        .where(eq(appointmentTypeTable.id, id))
        .returning({
            id: appointmentTypeTable.id,
            name: appointmentTypeTable.name,
            description: appointmentTypeTable.description,
            code: appointmentTypeTable.code,
            isActive: appointmentTypeTable.isActive,
            isDeleted: appointmentTypeTable.isDeleted,
        });
    
    return updatedAppointmentType;
}

async function deleteAppointmentType(id: number): Promise<void> {
    await db
        .update(appointmentTypeTable)
        .set({ isDeleted: true })
        .where(eq(appointmentTypeTable.id, id));
}

async function checkAppointmentTypeExists(name?: string, code?: string, excludeId?: number): Promise<{ nameExists: boolean; codeExists: boolean }> {
    const conditions = [];
    if (name) conditions.push(eq(appointmentTypeTable.name, name));
    if (code) conditions.push(eq(appointmentTypeTable.code, code));

    if (conditions.length === 0) {
        return { nameExists: false, codeExists: false };
    }

    const results = await db
        .select({ 
            id: appointmentTypeTable.id,
            name: appointmentTypeTable.name,
            code: appointmentTypeTable.code,
            isDeleted: appointmentTypeTable.isDeleted
        })
        .from(appointmentTypeTable)
        .where(or(...conditions));
    
    const activeResults = results.filter(r => !r.isDeleted && (excludeId === undefined || r.id !== excludeId));
    
    return {
        nameExists: name ? activeResults.some(r => r.name === name) : false,
        codeExists: code ? activeResults.some(r => r.code === code) : false
    };
}

export const appointmentTypeRepository = {
    createAppointmentType,
    getAppointmentTypes,
    getAppointmentTypeById,
    updateAppointmentType,
    deleteAppointmentType,
    checkAppointmentTypeExists,
}

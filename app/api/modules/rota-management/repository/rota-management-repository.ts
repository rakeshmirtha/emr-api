import { db } from "@/app/db";
import { rotaManagementTable } from "@/app/db/schema/rota-management";
import { CreateRotaManagementInput, UpdateRotaManagementInput } from "../schemas/rota-management-schema";
import { eq, count } from "drizzle-orm";

async function createRotaManagement(data: CreateRotaManagementInput) {
    const [created] = await db
        .insert(rotaManagementTable)
        .values({
            name: data.name,
            fromTime: data.fromTime,
            toTime: data.toTime,
            isActive: data.isActive ?? true,
        })
        .returning({
            id: rotaManagementTable.id,
            name: rotaManagementTable.name,
            fromTime: rotaManagementTable.fromTime,
            toTime: rotaManagementTable.toTime,
            isActive: rotaManagementTable.isActive,
            isDeleted: rotaManagementTable.isDeleted,
        });

    return created;
}

async function getRotaManagements({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
    const offset = (page - 1) * limit;

    const [data, [{ total }]] = await Promise.all([
        db
            .select({
                id: rotaManagementTable.id,
                name: rotaManagementTable.name,
                fromTime: rotaManagementTable.fromTime,
                toTime: rotaManagementTable.toTime,
                isActive: rotaManagementTable.isActive,
                isDeleted: rotaManagementTable.isDeleted,
            })
            .from(rotaManagementTable)
            .where(eq(rotaManagementTable.isDeleted, false))
            .limit(limit)
            .offset(offset),
        db
            .select({ total: count() })
            .from(rotaManagementTable)
            .where(eq(rotaManagementTable.isDeleted, false)),
    ]);

    return { data, total };
}

async function getRotaManagementById(id: number) {
    const result = await db
        .select({
            id: rotaManagementTable.id,
            name: rotaManagementTable.name,
            fromTime: rotaManagementTable.fromTime,
            toTime: rotaManagementTable.toTime,
            isActive: rotaManagementTable.isActive,
            isDeleted: rotaManagementTable.isDeleted,
        })
        .from(rotaManagementTable)
        .where(eq(rotaManagementTable.id, id))
        .limit(1);

    if (result[0]?.isDeleted) {
        return null;
    }

    return result[0] || null;
}

async function updateRotaManagement(id: number, data: UpdateRotaManagementInput) {
    const updateData: Partial<typeof rotaManagementTable.$inferInsert> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.fromTime !== undefined) updateData.fromTime = data.fromTime;
    if (data.toTime !== undefined) updateData.toTime = data.toTime;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const existing = await getRotaManagementById(id);
    if (!existing) {
        throw new Error("Rota management not found or has been deleted");
    }

    const [updated] = await db
        .update(rotaManagementTable)
        .set(updateData)
        .where(eq(rotaManagementTable.id, id))
        .returning({
            id: rotaManagementTable.id,
            name: rotaManagementTable.name,
            fromTime: rotaManagementTable.fromTime,
            toTime: rotaManagementTable.toTime,
            isActive: rotaManagementTable.isActive,
            isDeleted: rotaManagementTable.isDeleted,
        });

    return updated;
}

async function deleteRotaManagement(id: number): Promise<void> {
    await db
        .update(rotaManagementTable)
        .set({ isDeleted: true })
        .where(eq(rotaManagementTable.id, id));
}

async function checkRotaManagementNameExists(name: string, excludeId?: number): Promise<boolean> {
    const result = await db
        .select({
            id: rotaManagementTable.id,
            isDeleted: rotaManagementTable.isDeleted,
        })
        .from(rotaManagementTable)
        .where(eq(rotaManagementTable.name, name))
        .limit(1);

    if (result.length === 0 || result[0].isDeleted) {
        return false;
    }

    if (excludeId !== undefined && result[0].id === excludeId) {
        return false;
    }

    return true;
}

export const rotaManagementRepository = {
    createRotaManagement,
    getRotaManagements,
    getRotaManagementById,
    updateRotaManagement,
    deleteRotaManagement,
    checkRotaManagementNameExists,
};

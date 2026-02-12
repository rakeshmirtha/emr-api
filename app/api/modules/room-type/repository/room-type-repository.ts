import { db } from "@/app/db";
import { roomTypeTable } from "@/app/db/schema/room-type";
import { CreateRoomTypeInput, UpdateRoomTypeInput } from "../schemas/room-type-schema";
import { eq } from "drizzle-orm";

async function createRoomType(data: CreateRoomTypeInput): Promise<void> {
    await db.insert(roomTypeTable).values({
        name: data.name,
        description: data.description,
        isActive: data.isActive ?? true,
    });
}


async function getRoomTypes() {
    return await db
        .select({
            id: roomTypeTable.id,
            name: roomTypeTable.name,
            description: roomTypeTable.description,
            isActive: roomTypeTable.isActive,
        })
        .from(roomTypeTable)
        .where(eq(roomTypeTable.isActive, true));
}

async function getRoomTypeById(id: number) {
    const result = await db
        .select({
            id: roomTypeTable.id,
            name: roomTypeTable.name,
            description: roomTypeTable.description,
            isActive: roomTypeTable.isActive,
        })
        .from(roomTypeTable)
        .where(eq(roomTypeTable.id, id))
        .limit(1);
    
    return result[0] || null;
}

async function updateRoomType(id: number, data: UpdateRoomTypeInput): Promise<void> {
    const updateData: Partial<typeof roomTypeTable.$inferInsert> = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    await db
        .update(roomTypeTable)
        .set(updateData)
        .where(eq(roomTypeTable.id, id));
}

async function deleteRoomType(id: number): Promise<void> {
    await db
        .update(roomTypeTable)
        .set({ isActive: false })
        .where(eq(roomTypeTable.id, id));
}

export const roomTypeRepository = {
    createRoomType,
    getRoomTypes,
    getRoomTypeById,
    updateRoomType,
    deleteRoomType
}

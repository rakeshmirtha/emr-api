import { db } from "@/app/db";
import { roomTypeTable } from "@/app/db/schema/room-type";
import { CreateRoomTypeInput, UpdateRoomTypeInput } from "../schemas/room-type-schema";
import { eq } from "drizzle-orm";

async function createRoomType(data: CreateRoomTypeInput) {
    const [createdRoomType] = await db.insert(roomTypeTable).values({
        name: data.name,
        description: data.description,
        isActive: data.isActive ?? true,
    }).returning({
        id: roomTypeTable.id,
        name: roomTypeTable.name,
        description: roomTypeTable.description,
        isActive: roomTypeTable.isActive,
        isDeleted: roomTypeTable.isDeleted,
    });
    
    return createdRoomType;
}


async function getRoomTypes() {
    return await db
        .select({
            id: roomTypeTable.id,
            name: roomTypeTable.name,
            description: roomTypeTable.description,
            isActive: roomTypeTable.isActive,
            isDeleted: roomTypeTable.isDeleted,
        })
        .from(roomTypeTable)
        .where(eq(roomTypeTable.isDeleted, false));
}

async function getRoomTypeById(id: number) {
    const result = await db
        .select({
            id: roomTypeTable.id,
            name: roomTypeTable.name,
            description: roomTypeTable.description,
            isActive: roomTypeTable.isActive,
            isDeleted: roomTypeTable.isDeleted,
        })
        .from(roomTypeTable)
        .where(eq(roomTypeTable.id, id))
        .limit(1);
    
    if (result[0]?.isDeleted) {
        return null;
    }
    
    return result[0] || null;
}

async function updateRoomType(id: number, data: UpdateRoomTypeInput) {
    const updateData: Partial<typeof roomTypeTable.$inferInsert> = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const existing = await getRoomTypeById(id);
    if (!existing) {
        throw new Error("Room type not found or has been deleted");
    }

    const [updatedRoomType] = await db
        .update(roomTypeTable)
        .set(updateData)
        .where(eq(roomTypeTable.id, id))
        .returning({
            id: roomTypeTable.id,
            name: roomTypeTable.name,
            description: roomTypeTable.description,
            isActive: roomTypeTable.isActive,
            isDeleted: roomTypeTable.isDeleted,
        });
    
    return updatedRoomType;
}

async function deleteRoomType(id: number): Promise<void> {
    await db
        .update(roomTypeTable)
        .set({ isDeleted: true })
        .where(eq(roomTypeTable.id, id));
}

export const roomTypeRepository = {
    createRoomType,
    getRoomTypes,
    getRoomTypeById,
    updateRoomType,
    deleteRoomType
}

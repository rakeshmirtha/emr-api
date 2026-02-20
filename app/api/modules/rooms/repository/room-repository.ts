import { db } from "@/app/db";
import { roomTable } from "@/app/db/schema/room";
import { roomTypeTable } from "@/app/db/schema/room-type";
import { CreateRoomInput, UpdateRoomInput } from "../schemas/room-schema";
import { eq } from "drizzle-orm";

async function getRooms() {
    return await db
        .select({
            id: roomTable.id,
            name: roomTable.name,
            roomLocation: roomTable.roomLocation,
            roomTypeId: roomTable.roomTypeId,
            isActive: roomTable.isActive,
            isDeleted: roomTable.isDeleted,
            roomType: {
                id: roomTypeTable.id,
                name: roomTypeTable.name,
                description: roomTypeTable.description,
                isActive: roomTypeTable.isActive,
                isDeleted: roomTypeTable.isDeleted,
            }
        })
        .from(roomTable)
        .innerJoin(roomTypeTable, eq(roomTable.roomTypeId, roomTypeTable.id))
        .where(eq(roomTable.isDeleted, false));
}

async function createRoom(data: CreateRoomInput) {
    const [createdRoom] = await db.insert(roomTable).values({
        name: data.name,
        roomTypeId: data.roomTypeId,
        roomLocation: data.roomLocation ?? "",
        isActive: data.isActive ?? true,
        isDeleted: data.isDeleted ?? false,
    }).returning({
        id: roomTable.id,
        name: roomTable.name,
        roomLocation: roomTable.roomLocation,
        roomTypeId: roomTable.roomTypeId,
        isActive: roomTable.isActive,
        isDeleted: roomTable.isDeleted,
    });
    
    const roomWithType = await getRoomById(createdRoom.id);
    return roomWithType!;
}

async function getRoomById(id: number) {
    const result = await db
        .select({
            id: roomTable.id,
            name: roomTable.name,
            roomLocation: roomTable.roomLocation,
            roomTypeId: roomTable.roomTypeId,
            isActive: roomTable.isActive,
            isDeleted: roomTable.isDeleted,
            roomType: {
                id: roomTypeTable.id,
                name: roomTypeTable.name,
                description: roomTypeTable.description,
                isActive: roomTypeTable.isActive,
                isDeleted: roomTypeTable.isDeleted,
            }
        })
        .from(roomTable)
        .innerJoin(roomTypeTable, eq(roomTable.roomTypeId, roomTypeTable.id))
        .where(eq(roomTable.id, id))
        .limit(1);
    
    if (result[0]?.isDeleted) {
        return null;
    }
    
    return result[0] || null;
}

async function updateRoom(id: number, data: UpdateRoomInput) {
    const updateData: Partial<typeof roomTable.$inferInsert> = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.roomTypeId !== undefined) updateData.roomTypeId = data.roomTypeId;
    if (data.roomLocation !== undefined) updateData.roomLocation = data.roomLocation;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const existing = await getRoomById(id);
    if (!existing) {
        throw new Error("Room not found or has been deleted");
    }

    await db
        .update(roomTable)
        .set(updateData)
        .where(eq(roomTable.id, id));
    
    const updatedRoom = await getRoomById(id);
    return updatedRoom!;
}

async function deleteRoom(id: number): Promise<void> {
    await db
        .update(roomTable)
        .set({ isDeleted: true })
        .where(eq(roomTable.id, id));
}

async function checkRoomNameExists(name: string, excludeId?: number): Promise<boolean> {
    const result = await db
        .select({ 
            id: roomTable.id,
            isDeleted: roomTable.isDeleted
        })
        .from(roomTable)
        .where(eq(roomTable.name, name))
        .limit(1);
    
    if (result.length === 0 || result[0].isDeleted) {
        return false;
    }
    
    if (excludeId !== undefined && result[0].id === excludeId) {
        return false;
    }
    
    return true;
}

export const roomRepository = {
    getRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
    checkRoomNameExists
}

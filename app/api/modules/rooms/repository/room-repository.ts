import { db } from "@/app/db";
import { roomTable } from "@/app/db/schema/room";
import { roomTypeTable } from "@/app/db/schema/room-type";
import { CreateRoomInput } from "../schemas/room-schema";
import { eq } from "drizzle-orm";

async function getRooms() {
    return await db
        .select({
            id: roomTable.id,
            name: roomTable.name,
            roomLocation: roomTable.roomLocation,
            roomTypeId: roomTable.roomTypeId,
            isActive: roomTable.isActive,
            roomType: {
                id: roomTypeTable.id,
                name: roomTypeTable.name,
                description: roomTypeTable.description,
                isActive: roomTypeTable.isActive,
            }
        })
        .from(roomTable)
        .innerJoin(roomTypeTable, eq(roomTable.roomTypeId, roomTypeTable.id))
        .where(eq(roomTable.isDeleted, false));
}

async function createRoom(data: CreateRoomInput): Promise<void> {
    await db.insert(roomTable).values({
        name: data.name,
        roomTypeId: data.roomTypeId,
        roomLocation: data.roomLocation ?? "",
        isActive: data.isActive ?? true,
        isDeleted: data.isDeleted ?? false,
    });
}

export const roomRepository = {
    getRooms,
    createRoom
}

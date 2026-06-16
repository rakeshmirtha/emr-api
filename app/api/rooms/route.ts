import { NextRequest, NextResponse } from "next/server";
import { getRoomsQuery } from "../modules/rooms/queries/get-rooms-query";
import { createRoomCommand } from "../modules/rooms/commands/create-room-command";

export async function GET() {
    const rooms = await getRoomsQuery();
    
const result = rooms.map((room) => {
    return {
        id: room.id,
        name: room.name,
        roomLocation: room.roomLocation,
        roomTypeId: room.roomTypeId,
        isActive: room.isActive,
        roomType: {
            id: room.roomType.id,
            name: room.roomType.name,
            description: room.roomType.description,
            isActive: room.roomType.isActive,
        },
    }
})

    return NextResponse.json({ data: result });
}

export async function POST(request: NextRequest) {
    const payload = await request.json();

    const result = await createRoomCommand(payload);

    if (!result.success) {
        return NextResponse.json({ message: "Validation failed", errors: result.errors }, { status: 400 });
    }

    const response = {
        id: result.data!.id,
        name: result.data!.name,
        roomLocation: result.data!.roomLocation,
        roomTypeId: result.data!.roomTypeId,
        isActive: result.data!.isActive,
        roomType: {
            id: result.data!.roomType.id,
            name: result.data!.roomType.name,
            description: result.data!.roomType.description,
            isActive: result.data!.roomType.isActive,
        },
    }

    return NextResponse.json({ data: response }, { status: 201 });
}

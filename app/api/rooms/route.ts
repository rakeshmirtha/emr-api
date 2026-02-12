import { NextRequest, NextResponse } from "next/server";
import { getRoomsQuery } from "../modules/rooms/queries/get-rooms-query";
import { createRoomCommand } from "../modules/rooms/commands/create-room-command";

export async function GET() {
    const rooms = await getRoomsQuery();
    
    return NextResponse.json({ data: rooms });
}

export async function POST(request: NextRequest) {
    const payload = await request.json();

    const result = await createRoomCommand(payload);

    if (!result.success) {
        return NextResponse.json({ message: "Validation failed", errors: result.errors }, { status: 400 });
    }

    return NextResponse.json({ data: "Room created successfully" });
}

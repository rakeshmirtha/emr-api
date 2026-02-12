import { NextRequest, NextResponse } from "next/server";

import { getRoomTypesQuery } from "../modules/room-type/queries/get-room-types-query";
import { createRoomTypeCommand } from "../modules/room-type/commands/create-room-type-command";

export async function GET() {
    const roomTypes = await getRoomTypesQuery();
    
    return NextResponse.json({ data: roomTypes });
}

export async function POST(request: NextRequest) {
    const payload = await request.json();

    const result = await createRoomTypeCommand(payload);

    if (!result.success) {
        return NextResponse.json({ message: "Validation failed", errors: result.errors }, { status: 400 });
    }

    return NextResponse.json({ data: "Room type created successfully" });
}

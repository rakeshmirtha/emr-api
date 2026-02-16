import { NextRequest, NextResponse } from "next/server";
import { getRoomByIdQuery } from "../../modules/rooms/queries/get-room-by-id-query";
import { updateRoomCommand } from "../../modules/rooms/commands/update-room-command";
import { deleteRoomCommand } from "../../modules/rooms/commands/delete-room-command";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
        return NextResponse.json(
            { message: "Invalid room ID" },
            { status: 400 }
        );
    }

    const room = await getRoomByIdQuery(id);

    if (!room) {
        return NextResponse.json(
            { message: "Room not found" },
            { status: 404 }
        );
    }

    return NextResponse.json({ data: room });
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
        return NextResponse.json(
            { message: "Invalid room ID" },
            { status: 400 }
        );
    }

    const payload = await request.json();
    const result = await updateRoomCommand(id, payload);

    if (!result.success) {
        return NextResponse.json(
            { message: result.errors?.[0] || "Validation failed", errors: result.errors },
            { status: 400 }
        );
    }

    return NextResponse.json({ data: result.data });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
        return NextResponse.json(
            { message: "Invalid room ID" },
            { status: 400 }
        );
    }

    const existingRoom = await getRoomByIdQuery(id);
    if (!existingRoom) {
        return NextResponse.json(
            { message: "Room not found" },
            { status: 404 }
        );
    }

    const result = await deleteRoomCommand(id);

    if (!result.success) {
        return NextResponse.json(
            { message: "Failed to delete room", errors: result.errors },
            { status: 400 }
        );
    }

    return NextResponse.json({ data: "Room deleted successfully" });
}

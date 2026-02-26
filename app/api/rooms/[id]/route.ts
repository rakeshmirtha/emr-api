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

    const result = {
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

    return NextResponse.json({ data: result });
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

    return NextResponse.json({ data: response });
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

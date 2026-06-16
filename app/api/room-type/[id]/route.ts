import { NextRequest, NextResponse } from "next/server";
import { getRoomTypeByIdQuery } from "../../modules/room-type/queries/get-room-type-by-id-query";
import { updateRoomTypeCommand } from "../../modules/room-type/commands/update-room-type-command";
import { deleteRoomTypeCommand } from "../../modules/room-type/commands/delete-room-type-command";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
        return NextResponse.json(
            { message: "Invalid room type ID" },
            { status: 400 }
        );
    }

    const roomType = await getRoomTypeByIdQuery(id);

    if (!roomType) {
        return NextResponse.json(
            { message: "Room type not found" },
            { status: 404 }
        );
    }

    const result = {
        id: roomType.id,
        name: roomType.name,
        description: roomType.description,
        isActive: roomType.isActive,
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
            { message: "Invalid room type ID" },
            { status: 400 }
        );
    }

    const existingRoomType = await getRoomTypeByIdQuery(id);
    if (!existingRoomType) {
        return NextResponse.json(
            { message: "Room type not found" },
            { status: 404 }
        );
    }

    const payload = await request.json();
    const result = await updateRoomTypeCommand(id, payload);

    if (!result.success) {
        return NextResponse.json(
            { message: "Validation failed", errors: result.errors },
            { status: 400 }
        );
    }

    const response = {
        id: result.data.id,
        name: result.data.name,
        description: result.data.description,
        isActive: result.data.isActive,
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
            { message: "Invalid room type ID" },
            { status: 400 }
        );
    }

    const existingRoomType = await getRoomTypeByIdQuery(id);
    if (!existingRoomType) {
        return NextResponse.json(
            { message: "Room type not found" },
            { status: 404 }
        );
    }

    const result = await deleteRoomTypeCommand(id);

    if (!result.success) {
        return NextResponse.json(
            { message: "Failed to delete room type", errors: result.errors },
            { status: 400 }
        );
    }

    return NextResponse.json({ data: "Room type deleted successfully" });
}

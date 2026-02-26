import { NextRequest, NextResponse } from "next/server";
import { getRotaManagementByIdQuery } from "../../modules/rota-management/queries/get-rota-management-by-id-query";
import { updateRotaManagementCommand } from "../../modules/rota-management/commands/update-rota-management-command";
import { deleteRotaManagementCommand } from "../../modules/rota-management/commands/delete-rota-management-command";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
        return NextResponse.json({ message: "Invalid rota management ID" }, { status: 400 });
    }

    const rota = await getRotaManagementByIdQuery(id);

    if (!rota) {
        return NextResponse.json({ message: "Rota management not found" }, { status: 404 });
    }

    const result = {
        id: rota.id,
        name: rota.name,
        fromTime: rota.fromTime,
        toTime: rota.toTime,
        isActive: rota.isActive,
    };

    return NextResponse.json({ data: result });
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
        return NextResponse.json({ message: "Invalid rota management ID" }, { status: 400 });
    }

    const existingRota = await getRotaManagementByIdQuery(id);
    if (!existingRota) {
        return NextResponse.json({ message: "Rota management not found" }, { status: 404 });
    }

    const payload = await request.json();
    const result = await updateRotaManagementCommand(id, payload);

    if (!result.success) {
        return NextResponse.json(
            { message: "Validation failed", errors: result.errors },
            { status: 400 }
        );
    }

    const response = {
        id: result.data.id,
        name: result.data.name,
        fromTime: result.data.fromTime,
        toTime: result.data.toTime,
        isActive: result.data.isActive,
    };

    return NextResponse.json({ data: response });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
        return NextResponse.json({ message: "Invalid rota management ID" }, { status: 400 });
    }

    const existingRota = await getRotaManagementByIdQuery(id);
    if (!existingRota) {
        return NextResponse.json({ message: "Rota management not found" }, { status: 404 });
    }

    const result = await deleteRotaManagementCommand(id);

    if (!result.success) {
        return NextResponse.json(
            { message: "Failed to delete rota management", errors: result.errors },
            { status: 400 }
        );
    }

    return NextResponse.json({ data: "Rota management deleted successfully" });
}

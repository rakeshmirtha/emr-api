import { NextRequest, NextResponse } from "next/server";
import { getClinicianByIdQuery } from "../../modules/clinician/queries/get-clinician-by-id-query";
import { updateClinicianCommand } from "../../modules/clinician/commands/update-clinician-command";
import { deleteClinicianCommand } from "../../modules/clinician/commands/delete-clinician-command";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
        return NextResponse.json(
            { message: "Invalid clinician ID" },
            { status: 400 }
        );
    }

    const clinician = await getClinicianByIdQuery(id);

    if (!clinician) {
        return NextResponse.json(
            { message: "Clinician not found" },
            { status: 404 }
        );
    }

    const result = {
        id: clinician.id,
        name: clinician.name,
        code: clinician.code,
        isActive: clinician.isActive,
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
        return NextResponse.json(
            { message: "Invalid clinician ID" },
            { status: 400 }
        );
    }

    const existingClinician = await getClinicianByIdQuery(id);
    if (!existingClinician) {
        return NextResponse.json(
            { message: "Clinician not found" },
            { status: 404 }
        );
    }

    const payload = await request.json();
    const result = await updateClinicianCommand(id, payload);

    if (!result.success) {
        return NextResponse.json(
            { message: "Validation failed", errors: result.errors },
            { status: 400 }
        );
    }

    const response = {
        id: result.data.id,
        name: result.data.name,
        code: result.data.code,
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
        return NextResponse.json(
            { message: "Invalid clinician ID" },
            { status: 400 }
        );
    }

    const existingClinician = await getClinicianByIdQuery(id);
    if (!existingClinician) {
        return NextResponse.json(
            { message: "Clinician not found" },
            { status: 404 }
        );
    }

    const result = await deleteClinicianCommand(id);

    if (!result.success) {
        return NextResponse.json(
            { message: "Failed to delete clinician", errors: result.errors },
            { status: 400 }
        );
    }

    return NextResponse.json({ data: "Clinician deleted successfully" });
}

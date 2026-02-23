import { NextRequest, NextResponse } from "next/server";
import { getAppointmentTypeByIdQuery } from "../../modules/appointment-type/queries/get-appointment-type-by-id-query";
import { updateAppointmentTypeCommand } from "../../modules/appointment-type/commands/update-appointment-type-command";
import { deleteAppointmentTypeCommand } from "../../modules/appointment-type/commands/delete-appointment-type-command";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
        return NextResponse.json(
            { message: "Invalid appointment type ID" },
            { status: 400 }
        );
    }

    const appointmentType = await getAppointmentTypeByIdQuery(id);

    if (!appointmentType) {
        return NextResponse.json(
            { message: "Appointment type not found" },
            { status: 404 }
        );
    }

    return NextResponse.json({ data: appointmentType });
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
        return NextResponse.json(
            { message: "Invalid appointment type ID" },
            { status: 400 }
        );
    }

    const existingAppointmentType = await getAppointmentTypeByIdQuery(id);
    if (!existingAppointmentType) {
        return NextResponse.json(
            { message: "Appointment type not found" },
            { status: 404 }
        );
    }

    const payload = await request.json();
    const result = await updateAppointmentTypeCommand(id, payload);

    if (!result.success) {
        return NextResponse.json(
            { message: "Validation failed", errors: result.errors },
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
            { message: "Invalid appointment type ID" },
            { status: 400 }
        );
    }

    const existingAppointmentType = await getAppointmentTypeByIdQuery(id);
    if (!existingAppointmentType) {
        return NextResponse.json(
            { message: "Appointment type not found" },
            { status: 404 }
        );
    }

    const result = await deleteAppointmentTypeCommand(id);

    if (!result.success) {
        return NextResponse.json(
            { message: "Failed to delete appointment type", errors: result.errors },
            { status: 400 }
        );
    }

    return NextResponse.json({ data: "Appointment type deleted successfully" });
}

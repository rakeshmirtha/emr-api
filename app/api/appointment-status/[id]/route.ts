import { NextRequest, NextResponse } from "next/server";
import { getAppointmentStatusByIdQuery } from "../../modules/appointment-status/queries/get-appointment-status-by-id-query";
import { updateAppointmentStatusCommand } from "../../modules/appointment-status/commands/update-appointment-status-command";
import { deleteAppointmentStatusCommand } from "../../modules/appointment-status/commands/delete-appointment-status-command";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
        return NextResponse.json(
            { message: "Invalid appointment status ID" },
            { status: 400 }
        );
    }

    const appointmentStatus = await getAppointmentStatusByIdQuery(id);

    if (!appointmentStatus) {
        return NextResponse.json(
            { message: "Appointment status not found" },
            { status: 404 }
        );
    }

    return NextResponse.json({ data: appointmentStatus });
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
        return NextResponse.json(
            { message: "Invalid appointment status ID" },
            { status: 400 }
        );
    }

    const existingAppointmentStatus = await getAppointmentStatusByIdQuery(id);
    if (!existingAppointmentStatus) {
        return NextResponse.json(
            { message: "Appointment status not found" },
            { status: 404 }
        );
    }

    const payload = await request.json();
    const result = await updateAppointmentStatusCommand(id, payload);

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
            { message: "Invalid appointment status ID" },
            { status: 400 }
        );
    }

    const existingAppointmentStatus = await getAppointmentStatusByIdQuery(id);
    if (!existingAppointmentStatus) {
        return NextResponse.json(
            { message: "Appointment status not found" },
            { status: 404 }
        );
    }

    const result = await deleteAppointmentStatusCommand(id);

    if (!result.success) {
        return NextResponse.json(
            { message: "Failed to delete appointment status", errors: result.errors },
            { status: 400 }
        );
    }

    return NextResponse.json({ data: "Appointment status deleted successfully" });
}

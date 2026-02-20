import { NextRequest, NextResponse } from "next/server";
import { getAppointmentModeByIdQuery } from "../../modules/appointment-mode/queries/get-appointment-mode-by-id-query";
import { updateAppointmentModeCommand } from "../../modules/appointment-mode/commands/update-appointment-mode-command";
import { deleteAppointmentModeCommand } from "../../modules/appointment-mode/commands/delete-appointment-mode-command";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
        return NextResponse.json(
            { message: "Invalid appointment mode ID" },
            { status: 400 }
        );
    }

    const appointmentMode = await getAppointmentModeByIdQuery(id);

    if (!appointmentMode) {
        return NextResponse.json(
            { message: "Appointment mode not found" },
            { status: 404 }
        );
    }

    return NextResponse.json({ data: appointmentMode });
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
        return NextResponse.json(
            { message: "Invalid appointment mode ID" },
            { status: 400 }
        );
    }

    const existingAppointmentMode = await getAppointmentModeByIdQuery(id);
    if (!existingAppointmentMode) {
        return NextResponse.json(
            { message: "Appointment mode not found" },
            { status: 404 }
        );
    }

    const payload = await request.json();
    const result = await updateAppointmentModeCommand(id, payload);

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
            { message: "Invalid appointment mode ID" },
            { status: 400 }
        );
    }

    const existingAppointmentMode = await getAppointmentModeByIdQuery(id);
    if (!existingAppointmentMode) {
        return NextResponse.json(
            { message: "Appointment mode not found" },
            { status: 404 }
        );
    }

    const result = await deleteAppointmentModeCommand(id);

    if (!result.success) {
        return NextResponse.json(
            { message: "Failed to delete appointment mode", errors: result.errors },
            { status: 400 }
        );
    }

    return NextResponse.json({ data: "Appointment mode deleted successfully" });
}

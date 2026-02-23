import { NextRequest, NextResponse } from "next/server";
import { getAppointmentReasonByIdQuery } from "../../modules/appointment-reason/queries/get-appointment-reason-by-id-query";
import { updateAppointmentReasonCommand } from "../../modules/appointment-reason/commands/update-appointment-reason-command";
import { deleteAppointmentReasonCommand } from "../../modules/appointment-reason/commands/delete-appointment-reason-command";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
        return NextResponse.json(
            { message: "Invalid appointment reason ID" },
            { status: 400 }
        );
    }

    const appointmentReason = await getAppointmentReasonByIdQuery(id);

    if (!appointmentReason) {
        return NextResponse.json(
            { message: "Appointment reason not found" },
            { status: 404 }
        );
    }

    const result = {
        id: appointmentReason.id,
        name: appointmentReason.name,
        description: appointmentReason.description,
        code: appointmentReason.code,
        isActive: appointmentReason.isActive,
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
            { message: "Invalid appointment reason ID" },
            { status: 400 }
        );
    }

    const existingAppointmentReason = await getAppointmentReasonByIdQuery(id);
    if (!existingAppointmentReason) {
        return NextResponse.json(
            { message: "Appointment reason not found" },
            { status: 404 }
        );
    }

    const payload = await request.json();
    const result = await updateAppointmentReasonCommand(id, payload);

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
        code: result.data.code,
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
            { message: "Invalid appointment reason ID" },
            { status: 400 }
        );
    }

    const existingAppointmentReason = await getAppointmentReasonByIdQuery(id);
    if (!existingAppointmentReason) {
        return NextResponse.json(
            { message: "Appointment reason not found" },
            { status: 404 }
        );
    }

    const result = await deleteAppointmentReasonCommand(id);

    if (!result.success) {
        return NextResponse.json(
            { message: "Failed to delete appointment reason", errors: result.errors },
            { status: 400 }
        );
    }

    return NextResponse.json({ data: "Appointment reason deleted successfully" });
}

import { NextRequest, NextResponse } from "next/server";
import { getPatientByIdQuery } from "../../modules/patient/queries/get-patient-by-id-query";
import { updatePatientCommand } from "../../modules/patient/commands/update-patient-command";
import { deletePatientCommand } from "../../modules/patient/commands/delete-patient-command";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
        return NextResponse.json(
            { message: "Invalid patient ID" },
            { status: 400 }
        );
    }

    const patient = await getPatientByIdQuery(id);

    if (!patient) {
        return NextResponse.json(
            { message: "Patient not found" },
            { status: 404 }
        );
    }

    const result = {
        id: patient.id,
        name: patient.name,
        isActive: patient.isActive,
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
            { message: "Invalid patient ID" },
            { status: 400 }
        );
    }

    const existingPatient = await getPatientByIdQuery(id);
    if (!existingPatient) {
        return NextResponse.json(
            { message: "Patient not found" },
            { status: 404 }
        );
    }

    const payload = await request.json();
    const result = await updatePatientCommand(id, payload);

    if (!result.success) {
        return NextResponse.json(
            { message: "Validation failed", errors: result.errors },
            { status: 400 }
        );
    }

    const response = {
        id: result.data.id,
        name: result.data.name,
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
            { message: "Invalid patient ID" },
            { status: 400 }
        );
    }

    const existingPatient = await getPatientByIdQuery(id);
    if (!existingPatient) {
        return NextResponse.json(
            { message: "Patient not found" },
            { status: 404 }
        );
    }

    const result = await deletePatientCommand(id);

    if (!result.success) {
        return NextResponse.json(
            { message: "Failed to delete patient", errors: result.errors },
            { status: 400 }
        );
    }

    return NextResponse.json({ data: "Patient deleted successfully" });
}

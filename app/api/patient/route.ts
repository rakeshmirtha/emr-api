import { NextRequest, NextResponse } from "next/server";
import { getPatientsQuery } from "../modules/patient/queries/get-patients-query";
import { createPatientCommand } from "../modules/patient/commands/create-patient-command";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));

    const { data, total } = await getPatientsQuery({ page, limit });

    const result = data.map((patient) => ({
        id: patient.id,
        name: patient.name,
        isActive: patient.isActive,
    }));

    return NextResponse.json({
        data: result,
        pageSize: limit,
        pageNumber: page,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
    });
}

export async function POST(request: NextRequest) {
    const payload = await request.json();

    const result = await createPatientCommand(payload);

    if (!result.success) {
        return NextResponse.json({ message: "Validation failed", errors: result.errors }, { status: 400 });
    }

    const response = {
        id: result.data.id,
        name: result.data.name,
        isActive: result.data.isActive,
    };

    return NextResponse.json({ data: response }, { status: 201 });
}

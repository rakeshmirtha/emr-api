import { NextRequest, NextResponse } from "next/server";
import { getCliniciansQuery } from "../modules/clinician/queries/get-clinicians-query";
import { createClinicianCommand } from "../modules/clinician/commands/create-clinician-command";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));

    const { data, total } = await getCliniciansQuery({ page, limit });

    const result = data.map((clinician) => ({
        id: clinician.id,
        name: clinician.name,
        code: clinician.code,
        isActive: clinician.isActive,
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

    const result = await createClinicianCommand(payload);

    if (!result.success) {
        return NextResponse.json({ message: "Validation failed", errors: result.errors }, { status: 400 });
    }

    const response = {
        id: result.data.id,
        name: result.data.name,
        code: result.data.code,
        isActive: result.data.isActive,
    };

    return NextResponse.json({ data: response }, { status: 201 });
}

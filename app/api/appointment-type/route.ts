import { NextRequest, NextResponse } from "next/server";

import { getAppointmentTypesQuery } from "../modules/appointment-type/queries/get-appointment-types-query";
import { createAppointmentTypeCommand } from "../modules/appointment-type/commands/create-appointment-type-command";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));

    const { data, total } = await getAppointmentTypesQuery({ page, limit });

const result = data.map((appointmentType) => {
    return {
        id: appointmentType.id,
        name: appointmentType.name,
        description: appointmentType.description,
        code: appointmentType.code,
        isActive: appointmentType.isActive,
    }
})

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

    const result = await createAppointmentTypeCommand(payload);

    if (!result.success) {
        return NextResponse.json({ message: "Validation failed", errors: result.errors }, { status: 400 });
    }

    const response = {
        id: result.data.id,
        name: result.data.name,
        description: result.data.description,
        code: result.data.code,
        isActive: result.data.isActive,
    }

    return NextResponse.json({ data: response }, { status: 201 });
}

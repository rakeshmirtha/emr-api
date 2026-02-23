import { NextRequest, NextResponse } from "next/server";

import { getAppointmentStatusesQuery } from "../modules/appointment-status/queries/get-appointment-statuses-query";
import { createAppointmentStatusCommand } from "../modules/appointment-status/commands/create-appointment-status-command";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));

    const { data, total } = await getAppointmentStatusesQuery({ page, limit });

const result = data.map((appointmentStatus) => {
    return {
        id: appointmentStatus.id,
        name: appointmentStatus.name,
        description: appointmentStatus.description,
        code: appointmentStatus.code,
        isActive: appointmentStatus.isActive,
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

    const result = await createAppointmentStatusCommand(payload);

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

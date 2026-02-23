import { NextRequest, NextResponse } from "next/server";

import { getAppointmentStatusesQuery } from "../modules/appointment-status/queries/get-appointment-statuses-query";
import { createAppointmentStatusCommand } from "../modules/appointment-status/commands/create-appointment-status-command";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));

    const { data, total } = await getAppointmentStatusesQuery({ page, limit });

    return NextResponse.json({
        data,
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

    return NextResponse.json({ data: result.data }, { status: 201 });
}

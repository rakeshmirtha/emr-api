import { NextRequest, NextResponse } from "next/server";

import { getAppointmentModesQuery } from "../modules/appointment-mode/queries/get-appointment-modes-query";
import { createAppointmentModeCommand } from "../modules/appointment-mode/commands/create-appointment-mode-command";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));

    const { data, total } = await getAppointmentModesQuery({ page, limit });

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

    const result = await createAppointmentModeCommand(payload);

    if (!result.success) {
        return NextResponse.json({ message: "Validation failed", errors: result.errors }, { status: 400 });
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
}

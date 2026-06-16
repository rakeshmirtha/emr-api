import { NextRequest, NextResponse } from "next/server";
import { createClinicianScheduleCommand } from "../modules/clinician-schedule/commands/create-clinician-schedule-command";
import { getClinicianSchedulesQuery } from "../modules/clinician-schedule/queries/get-clinician-schedules-query";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));

    const data = await getClinicianSchedulesQuery({ page, limit });

    return NextResponse.json({
        data,
        pageSize: limit,
        pageNumber: page,
        totalItems: data.length,
        totalPages: Math.ceil(data.length / limit),
    });
}

export async function POST(request: NextRequest) {
    const payload = await request.json();

    const result = await createClinicianScheduleCommand(payload);

    if (!result.success) {
        return NextResponse.json({ message: "Validation failed", errors: result.errors }, { status: 400 });
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
}


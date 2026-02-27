import { NextRequest, NextResponse } from "next/server";
import { createClinicianScheduleCommand } from "../modules/clinician-schedule/commands/create-clinician-schedule-command";

export async function POST(request: NextRequest) {
    const payload = await request.json();

    const result = await createClinicianScheduleCommand(payload);

    if (!result.success) {
        return NextResponse.json({ message: "Validation failed", errors: result.errors }, { status: 400 });
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
}

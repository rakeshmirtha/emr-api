import { NextRequest, NextResponse } from "next/server";
import { getClinicianScheduleByIdQuery } from "../../modules/clinician-schedule/queries/get-clinician-schedule-by-id-query";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
        return NextResponse.json(
            { message: "Invalid clinician schedule ID" },
            { status: 400 }
        );
    }

    const clinicianSchedule = await getClinicianScheduleByIdQuery(id);

    if (!clinicianSchedule) {
        return NextResponse.json(
            { message: "Clinician schedule not found" },
            { status: 404 }
        );
    }

    return NextResponse.json({ data: clinicianSchedule });
}

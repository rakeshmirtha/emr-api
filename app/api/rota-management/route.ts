import { NextRequest, NextResponse } from "next/server";
import { getRotaManagementsQuery } from "../modules/rota-management/queries/get-rota-managements-query";
import { createRotaManagementCommand } from "../modules/rota-management/commands/create-rota-management-command";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));

    const { data, total } = await getRotaManagementsQuery({ page, limit });

    const result = data.map((rota) => ({
        id: rota.id,
        name: rota.name,
        fromTime: rota.fromTime,
        toTime: rota.toTime,
        isActive: rota.isActive,
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

    const result = await createRotaManagementCommand(payload);

    if (!result.success) {
        return NextResponse.json({ message: "Validation failed", errors: result.errors }, { status: 400 });
    }

    const response = {
        id: result.data.id,
        name: result.data.name,
        fromTime: result.data.fromTime,
        toTime: result.data.toTime,
        isActive: result.data.isActive,
    };

    return NextResponse.json({ data: response }, { status: 201 });
}

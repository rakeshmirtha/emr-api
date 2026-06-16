import { db } from "@/app/db";
import { clinicians } from "@/app/db/schema/clinician";
import { CreateClinicianInput, UpdateClinicianInput } from "../schemas/clinician-schema";
import { eq, count } from "drizzle-orm";

async function createClinician(data: CreateClinicianInput) {
    const [created] = await db
        .insert(clinicians)
        .values({
            name: data.name,
            code: data.code,
            isActive: data.isActive ?? true,
        })
        .returning({
            id: clinicians.id,
            name: clinicians.name,
            code: clinicians.code,
            isActive: clinicians.isActive,
            isDeleted: clinicians.isDeleted,
        });

    return created;
}

async function getClinicians({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
    const offset = (page - 1) * limit;

    const [data, [{ total }]] = await Promise.all([
        db
            .select({
                id: clinicians.id,
                name: clinicians.name,
                code: clinicians.code,
                isActive: clinicians.isActive,
                isDeleted: clinicians.isDeleted,
            })
            .from(clinicians)
            .where(eq(clinicians.isDeleted, false))
            .limit(limit)
            .offset(offset),
        db
            .select({ total: count() })
            .from(clinicians)
            .where(eq(clinicians.isDeleted, false)),
    ]);

    return { data, total };
}

async function getClinicianById(id: number) {
    const result = await db
        .select({
            id: clinicians.id,
            name: clinicians.name,
            code: clinicians.code,
            isActive: clinicians.isActive,
            isDeleted: clinicians.isDeleted,
        })
        .from(clinicians)
        .where(eq(clinicians.id, id))
        .limit(1);

    if (result[0]?.isDeleted) {
        return null;
    }

    return result[0] || null;
}

async function updateClinician(id: number, data: UpdateClinicianInput) {
    const updateData: Partial<typeof clinicians.$inferInsert> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.code !== undefined) updateData.code = data.code;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const existing = await getClinicianById(id);
    if (!existing) {
        throw new Error("Clinician not found or has been deleted");
    }

    const [updated] = await db
        .update(clinicians)
        .set(updateData)
        .where(eq(clinicians.id, id))
        .returning({
            id: clinicians.id,
            name: clinicians.name,
            code: clinicians.code,
            isActive: clinicians.isActive,
            isDeleted: clinicians.isDeleted,
        });

    return updated;
}

async function deleteClinician(id: number): Promise<void> {
    await db
        .update(clinicians)
        .set({ isDeleted: true })
        .where(eq(clinicians.id, id));
}

export const clinicianRepository = {
    createClinician,
    getClinicians,
    getClinicianById,
    updateClinician,
    deleteClinician,
};

import { db } from "@/app/db";
import { patients } from "@/app/db/schema/patient";
import { CreatePatientInput, UpdatePatientInput } from "../schemas/patient-schema";
import { eq, count } from "drizzle-orm";

async function createPatient(data: CreatePatientInput) {
    const [created] = await db
        .insert(patients)
        .values({
            name: data.name,
            isActive: data.isActive ?? true,
        })
        .returning({
            id: patients.id,
            name: patients.name,
            isActive: patients.isActive,
            isDeleted: patients.isDeleted,
        });

    return created;
}

async function getPatients({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
    const offset = (page - 1) * limit;

    const [data, [{ total }]] = await Promise.all([
        db
            .select({
                id: patients.id,
                name: patients.name,
                isActive: patients.isActive,
                isDeleted: patients.isDeleted,
            })
            .from(patients)
            .where(eq(patients.isDeleted, false))
            .limit(limit)
            .offset(offset),
        db
            .select({ total: count() })
            .from(patients)
            .where(eq(patients.isDeleted, false)),
    ]);

    return { data, total };
}

async function getPatientById(id: number) {
    const result = await db
        .select({
            id: patients.id,
            name: patients.name,
            isActive: patients.isActive,
            isDeleted: patients.isDeleted,
        })
        .from(patients)
        .where(eq(patients.id, id))
        .limit(1);

    if (result[0]?.isDeleted) {
        return null;
    }

    return result[0] || null;
}

async function updatePatient(id: number, data: UpdatePatientInput) {
    const updateData: Partial<typeof patients.$inferInsert> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const existing = await getPatientById(id);
    if (!existing) {
        throw new Error("Patient not found or has been deleted");
    }

    const [updated] = await db
        .update(patients)
        .set(updateData)
        .where(eq(patients.id, id))
        .returning({
            id: patients.id,
            name: patients.name,
            isActive: patients.isActive,
            isDeleted: patients.isDeleted,
        });

    return updated;
}

async function deletePatient(id: number): Promise<void> {
    await db
        .update(patients)
        .set({ isDeleted: true })
        .where(eq(patients.id, id));
}

export const patientRepository = {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient,
};

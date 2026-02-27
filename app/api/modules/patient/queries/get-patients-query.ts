import { patientRepository } from "../repository/patient-repository";

export async function getPatientsQuery({ page, limit }: { page?: number; limit?: number } = {}) {
    return await patientRepository.getPatients({ page, limit });
}

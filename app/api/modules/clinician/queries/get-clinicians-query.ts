import { clinicianRepository } from "../repository/clinician-repository";

export async function getCliniciansQuery({ page, limit }: { page?: number; limit?: number } = {}) {
    return await clinicianRepository.getClinicians({ page, limit });
}

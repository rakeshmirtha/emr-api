import { clinicianRepository } from "../repository/clinician-repository";

export async function getClinicianByIdQuery(id: number) {
    return await clinicianRepository.getClinicianById(id);
}

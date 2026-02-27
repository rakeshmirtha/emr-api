import { patientRepository } from "../repository/patient-repository";

export async function getPatientByIdQuery(id: number) {
    return await patientRepository.getPatientById(id);
}

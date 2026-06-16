import { appointmentTypeRepository } from "../repository/appointment-type-repository";

export async function getAppointmentTypesQuery({ page, limit }: { page?: number; limit?: number } = {}) {
    return await appointmentTypeRepository.getAppointmentTypes({ page, limit });
}

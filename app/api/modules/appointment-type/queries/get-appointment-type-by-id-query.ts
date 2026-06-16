import { appointmentTypeRepository } from "../repository/appointment-type-repository";

export async function getAppointmentTypeByIdQuery(id: number) {
    return await appointmentTypeRepository.getAppointmentTypeById(id);
}

import { appointmentStatusRepository } from "../repository/appointment-status-repository";

export async function getAppointmentStatusByIdQuery(id: number) {
    return await appointmentStatusRepository.getAppointmentStatusById(id);
}

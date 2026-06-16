import { appointmentReasonRepository } from "../repository/appointment-reason-repository";

export async function getAppointmentReasonByIdQuery(id: number) {
    return await appointmentReasonRepository.getAppointmentReasonById(id);
}

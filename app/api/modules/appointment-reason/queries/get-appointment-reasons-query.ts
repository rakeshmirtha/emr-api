import { appointmentReasonRepository } from "../repository/appointment-reason-repository";

export async function getAppointmentReasonsQuery({ page, limit }: { page?: number; limit?: number } = {}) {
    return await appointmentReasonRepository.getAppointmentReasons({ page, limit });
}

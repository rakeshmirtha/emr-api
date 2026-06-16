import { appointmentStatusRepository } from "../repository/appointment-status-repository";

export async function getAppointmentStatusesQuery({ page, limit }: { page?: number; limit?: number } = {}) {
    return await appointmentStatusRepository.getAppointmentStatuses({ page, limit });
}

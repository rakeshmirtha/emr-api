import { appointmentModeRepository } from "../repository/appointment-mode-repository";

export async function getAppointmentModesQuery({ page, limit }: { page?: number; limit?: number } = {}) {
    return await appointmentModeRepository.getAppointmentModes({ page, limit });
}

import { appointmentModeRepository } from "../repository/appointment-mode-repository";

export async function getAppointmentModeByIdQuery(id: number) {
    return await appointmentModeRepository.getAppointmentModeById(id);
}

import { RegularUser } from './RegularUser'
import { Appointment } from './Appointment';

type Doctor = RegularUser

interface DoctorRepository {
    FetchAppointments(
        doctor: Doctor,
        offset: number,
        limit: number
    ): Promise<Array<Appointment>>
}

export { Doctor, DoctorRepository }
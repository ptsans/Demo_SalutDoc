import { Doctor } from './Doctor'
import { Patient } from './Patient'

type Date = {
    day: number
    month: number
    year: number
}

type Time = {
    hour: number
    minute: number
}

type AppointmentDate = {
    date: Date
    time: Time
}

type AppointmentComplaints = string

enum AppointmentStatus {
    Opened, Closed
}

type AppointmentId = number

type Appointment = {
    id: AppointmentId
    patient: Patient
    doctor: Doctor
    date: AppointmentDate
    complaints: AppointmentComplaints
    status: AppointmentStatus
}

interface AppointmentRepository {
    Create(
        patient: Patient,
        doctor: Doctor,
        date: AppointmentDate,
        complaints: AppointmentComplaints
    ): Promise<Appointment>

    Remove(
        id: AppointmentId
    ): Promise<boolean>
}

export { Appointment, AppointmentRepository }
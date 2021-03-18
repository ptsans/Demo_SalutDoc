import { Doctor } from './Doctor'
import { Patient } from './Patient'

type Date = {
    day: number
    month: number
    year: number
}

type Time = {
    hours: number
    minutes: number
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
    FetchOpened(
        doctor: Doctor,
        date: Date
    ): Promise<Array<Time>>

    FetchByDoctor(
        doctor: Doctor,
        date: Date | undefined,
        offset: number,
        limit: number
    ): Promise<Array<Appointment>>

    FetchByDate(
        doctor: Doctor,
        date: AppointmentDate
    ): Promise<Appointment>

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

export {
    Appointment,
    AppointmentRepository,
    AppointmentId,
    AppointmentComplaints,
    AppointmentDate,
    AppointmentStatus,
    Date,
    Time
}
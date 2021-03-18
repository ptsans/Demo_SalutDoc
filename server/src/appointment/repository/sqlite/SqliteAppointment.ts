import { Database } from 'sqlite3'
import {
    Appointment,
    AppointmentComplaints,
    AppointmentDate,
    AppointmentId,
    AppointmentRepository,
    AppointmentStatus,
    Date,
    Time
} from 'domain/Appointment'
import { Patient } from 'domain/Patient'
import { Doctor } from 'domain/Doctor'
import { FormatDate, FormatTime } from "./helper";

export class SqliteAppointmentRepository implements AppointmentRepository {
    protected conn: Database

    constructor(conn: Database) {
        this.conn = conn
    }

    async Create(
        patient: Patient,
        doctor: Doctor,
        date: AppointmentDate,
        complaints: AppointmentComplaints
    ): Promise<Appointment> {
        return new Promise<Appointment>((resolve, reject) => {
            this.conn.run(
                `insert into appointment (patient,  doctor,  date,         time,            complaints) 
                     values                  ($patient, $doctor, date($date),  time($time),    $complaints);`,
                {
                $patient: patient.id,
                $doctor: doctor.id,
                $date: FormatDate(date.date),
                $time: FormatTime(date.time),
                $complaints: complaints
            }, function (error) {
                if (error) return reject(error)

                const appointment: Appointment = {
                    id: Number(this.lastID),
                    complaints,
                    date,
                    doctor,
                    patient,
                    status: AppointmentStatus.Opened
                }

                return resolve(appointment)
            })
        })
    }

    async Remove(id: AppointmentId): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.conn.run(
                `update appointment 
                     set status = 1
                     where id = ?;`,
                id,
                function (error) {
                if (error) return reject(error)
                return resolve(true)
            })
        })
    }

    FetchByDoctor(
        doctor: Doctor,
        date: Date | undefined,
        offset: number,
        limit: number
    ): Promise<Array<Appointment>> {
        return new Promise<Array<Appointment>>((resolve, reject) => {
            const selects = ['appointment.id as id', 'p.name as patient_name', 'p.id as patient_id', 'doctor', 'complaints', 'date', 'time', 'status']
            const conditions = ['doctor = $doctor', 'appointment.id > $id', 'status = $status']
            const params: any = {
                $doctor: doctor.id,
                $id: offset,
                $status: AppointmentStatus.Opened
            }

            if (date) {
                conditions.push('date = $date')
                params.$date = FormatDate(date)
            }

            let query = `
                select ${selects.join(',')} 
                from appointment 
                join patient p on p.id = appointment.patient 
                where ${conditions.join(' and ')}
            `

            query += ('limit $limit;')
            params.$limit = limit

            this.conn.all(
                query,
                params,
                function (
                    error,
                    rows: {
                        id: number,
                        patient_id: number,
                        patient_name: string,
                        doctor: number,
                        date: string,
                        time: string,
                        complaints: string,
                        status: number
                    }[]
                ) {
                    if (error) return reject(error)
                    const appointments: Appointment[] = []

                    for (const row of rows) {
                        const dateMatch = row.date.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
                        const timeMatch = row.time.match(/^(\d{1,2}):(\d{1,2})/)

                        appointments.push(
                            {
                                id: row.id,
                                patient: {
                                    id: row.patient_id,
                                    name: {
                                        fullName: row.patient_name
                                    }
                                },
                                doctor: {
                                    id: row.doctor,
                                    name: {
                                        fullName: ''
                                    }
                                },
                                date: {
                                    date: {
                                        year: Number(dateMatch[1]),
                                        month: Number(dateMatch[2]),
                                        day: Number(dateMatch[3])
                                    },
                                    time: {
                                        hours: Number(timeMatch[1]),
                                        minutes: Number(timeMatch[2])
                                    }
                                },
                                complaints: row.complaints,
                                status: row.status
                            }
                        )
                    }

                    return resolve(appointments)
                }
            )
        })
    }



    FetchOpened(doctor: Doctor, date: Date): Promise<Array<Time>> {
        return new Promise<Array<Time>>((resolve, reject) => {

            let query = `
                select time 
                from appointment 
                where status = $status and date = $date;
            `

            console.log(FormatDate(date))

            const params = {
                $status: AppointmentStatus.Opened,
                $date: FormatDate(date),
            }

            const appointment: Time[] = []

            this.conn.each(
                query,
                params,
                (error, row: { time: string }) => {
                    if (error) return reject(error)

                    const timeMatch = row.time.match(/^(\d{1,2}):(\d{1,2})/)
                    const time: Time = {
                        hours: Number(timeMatch[1]),
                        minutes: Number(timeMatch[2])
                    }
                    appointment.push(time)
                },
                () => {
                    return resolve(appointment)
                })
        })
    }

    FetchByDate(doctor: Doctor, date: AppointmentDate): Promise<Appointment> {
        return new Promise<Appointment>((resolve, reject) => {
            const selects = ['appointment.id as id', 'p.name as patient_name', 'p.id as patient_id', 'doctor', 'complaints', 'date', 'time', 'status']
            const conditions = ['doctor = $doctor', 'date = $date', 'time = $time']
            const params: any = {
                $doctor: doctor.id,
                $date: FormatDate(date.date),
                $time: FormatTime(date.time)
            }

            let query = `
                select ${selects.join(',')} 
                from appointment 
                join patient p on p.id = appointment.patient 
                where ${conditions.join(' and ')};
            `

            this.conn.get(
                query,
                params,
                function (
                    error,
                    row: {
                        id: number,
                        patient_id: number,
                        patient_name: string,
                        doctor: number,
                        date: string,
                        time: string,
                        complaints: string,
                        status: number
                    }
                ) {
                    if (error) return reject(error)
                    if (!row) return resolve(undefined)

                    const dateMatch = row.date.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
                    const timeMatch = row.time.match(/^(\d{1,2}):(\d{1,2})/)
                    const { id, patient_id, patient_name, doctor, status, complaints } = row

                    const appointment: Appointment = {
                        id,
                        patient: {
                            id: patient_id,
                            name: {
                                fullName: patient_name
                            }
                        },
                        doctor: {
                            id: doctor,
                            name: {
                                fullName: ''
                            }
                        },
                        status,
                        complaints,
                        date: {
                            date: {
                                year: Number(dateMatch[1]),
                                month: Number(dateMatch[2]),
                                day: Number(dateMatch[3])
                            },
                            time: {
                                hours: Number(timeMatch[1]),
                                minutes: Number(timeMatch[2])
                            }
                        }
                    }

                    return resolve(appointment)
                }
            )
        })
    }
}
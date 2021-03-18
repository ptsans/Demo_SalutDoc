import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { DoctorRepository } from 'domain/Doctor'
import { AppointmentDate, AppointmentRepository, Date } from 'domain/Appointment'
import { PatientRepository } from 'domain/Patient'

type CreateBody = {
    patient: string
    doctor: number
    complaints: string
    time: {
        hours: number
        minutes: number
    },
    date: {
        day: number
        month: number
        year: number
    }
}
type FetchOpenedQuery = {
    date: string
    doctor: number
}

class AppointmentHandler {
    protected appointmentRepo: AppointmentRepository
    protected patientRepo: PatientRepository
    protected doctorRepo: DoctorRepository

    static CreateAppointmentSchema = {
        schema: {
            body: {
                type: 'object',
                properties: {
                    patient: {
                        type: 'string'
                    },
                    doctor: {
                        type: 'number'
                    },
                    complaints: {
                        type: 'string'
                    },
                    time: {
                        type: 'object',
                        properties: {
                            hours: {
                                type: 'number'
                            },
                            minutes: {
                                type: 'number'
                            }
                        }
                    },
                    date: {
                        type: 'object',
                        properties: {
                            day: {
                                type: 'number'
                            },
                            month: {
                                type: 'number'
                            },
                            year: {
                                type: 'number'
                            }
                        }
                    }
                },
                required: ['patient', 'doctor', 'complaints', 'time', 'date']
            }
        }
    }
    static FetchOpenedSchema = {
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    date: { type: 'string' },
                    doctor: { type: 'number' },
                },
                required: ['date', 'doctor'],
            }
        }
    }

    constructor(
        AppointmentRepo: AppointmentRepository,
        PatientRepo: PatientRepository,
        DoctorRepo: DoctorRepository
        ) {
        this.appointmentRepo = AppointmentRepo
        this.patientRepo = PatientRepo
        this.doctorRepo = DoctorRepo
    }

    async Create(request: FastifyRequest, response: FastifyReply) {
        let body = request.body as CreateBody

        if (body.time.hours < 9 || body.time.hours > 18) {
            return response.status(400).send()
        }

        if (body.time.minutes > 60 || (body.time.minutes % 30) > 0) {
            return response.status(400).send()
        }

        const availableDate = new global.Date()
        availableDate.setDate(availableDate.getDate() + 1)

        if (
            availableDate.getFullYear() !== body.date.year ||
            availableDate.getMonth() + 1 !== body.date.month ||
            availableDate.getDate() !== body.date.day
        ) {
            return response.status(400).send()
        }

        const date: AppointmentDate = {
            date: body.date,
            time: {
                hours: Math.round(body.time.hours),
                minutes: Math.round(body.time.minutes),
            }
        }

        const doctor = await this.doctorRepo.GetById(body.doctor)
            .catch(err => console.log(err))

        if (!doctor) {
            return response.status(400).send()
        }

        const complaints = body.complaints

        const oldAppointment = await this.appointmentRepo.FetchByDate(doctor, date)
            .catch(err => console.log(err))

        if (oldAppointment) {
            return response.status(400).send()
        }

        const patient = await this.patientRepo.Create({ fullName: body.patient })
            .catch(err => console.log(err))

        if (!patient) {
            return response.status(400).send()
        }

        const appointment = await this.appointmentRepo.Create(patient, doctor, date, complaints)
            .catch(err => console.log(err))

        return response.send({
            data: appointment
        })
    }

    async FetchOpened(request: FastifyRequest, response: FastifyReply) {
        let query = request.query as FetchOpenedQuery

        const match = query.date.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/)
        if (!match) {
            return response.status(500).send()
        }

        const date: Date = {
            day:    Number(match[1]),
            month:  Number(match[2]),
            year:   Number(match[3])
        }

        const doctor = await this.doctorRepo.GetById(query.doctor)
            .catch(err => console.log(err))

        if (!doctor) return response.status(404).send()

        const appointments = await this.appointmentRepo.FetchOpened(doctor, date)
            .catch(err => console.log(err))

        return response.send({
            data: appointments
        })
    }
}

export function HandleAppointment(
    router: FastifyInstance,
    appointmentRepo: AppointmentRepository,
    patientRepo: PatientRepository,
    doctorRepo: DoctorRepository
) {
    const handler = new AppointmentHandler(
        appointmentRepo,
        patientRepo,
        doctorRepo
    )
    router.post(
        '/appointment',
        AppointmentHandler.CreateAppointmentSchema,
        handler.Create.bind(handler)
    )
    router.get(
        '/appointment',
        AppointmentHandler.FetchOpenedSchema,
        handler.FetchOpened.bind(handler)
    )
}


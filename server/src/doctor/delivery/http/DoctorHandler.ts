import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { DoctorRepository } from 'domain/Doctor'
import { AppointmentRepository, Date } from 'domain/Appointment'

type FetchAppointmentsQuery = {
    date?: string
    limit: number
    offset: number
}

type FetchAppointmentsParams = {
    id: number
}

class DoctorHandler {
    protected doctorRepo: DoctorRepository
    protected appointmentRepo: AppointmentRepository

    static FetchAppointmentsSchema = {
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: { type: 'number' }
                }
            },
            querystring: {
                type: 'object',
                properties: {
                    date: { type: 'string' },
                    limit: { type: 'number', default: 15 },
                    offset: { type: 'number', default: 0 },
                }
            }
        }
    }

    constructor(
        AppointmentRepo: AppointmentRepository,
        DoctorRepo: DoctorRepository
    ) {
        this.appointmentRepo = AppointmentRepo
        this.doctorRepo = DoctorRepo
    }

    async FetchAppointments(request: FastifyRequest, response: FastifyReply) {
        const { id } = request.params as FetchAppointmentsParams
        let { date, limit, offset } = request.query as FetchAppointmentsQuery
        let formattedDate: Date

        if (limit < 0) limit = 15
        if (offset < 0) offset = 0

        if (date) {
            const match = date.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/)
            if (match) {
                formattedDate = {
                    day:    Number(match[1]),
                    month:  Number(match[2]),
                    year:   Number(match[3])
                }
            }
        }

        const doctor = await this.doctorRepo.GetById(id)
            .catch(err => console.log(err))

        if (!doctor) return response.status(404).send()

        const appointments = await this.appointmentRepo.FetchByDoctor(doctor, formattedDate, offset, limit)
            .catch(err => console.log(err))

        return response.send({
            data: appointments
        })
    }
    async GetAll(request: FastifyRequest, response: FastifyReply) {
        const doctors = await this.doctorRepo.GetAll()
            .catch(err => console.log(err))

        return response.send({
            data: doctors
        })
    }
}

export function HandleDoctor(
    router: FastifyInstance,
    appointmentRepo: AppointmentRepository,
    doctorRepo: DoctorRepository
) {
    const handler = new DoctorHandler(appointmentRepo, doctorRepo)
    router.get(
        '/doctor/:id/appointments',
        DoctorHandler.FetchAppointmentsSchema,
        handler.FetchAppointments.bind(handler)
    )
    router.get(
        '/doctors',
        handler.GetAll.bind(handler)
    )
}


import fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import { Database } from 'sqlite3'
import { SqliteDoctorRepository } from 'doctor/repository/sqlite/SqliteDoctor'
import { SqliteAppointmentRepository } from 'appointment/repository/sqlite/SqliteAppointment'
import { SqlitePatientRepository } from 'patient/repository/sqlite/SqlitePatient'
import { HandleAppointment } from 'appointment/delivery/http/AppointmentHandler'
import { HandleDoctor } from 'doctor/delivery/http/DoctorHandler'

const db = new Database('./database/develop.sqlite', (err) => {
    if (err) throw new Error(err.stack)
})

const doctorRepo = new SqliteDoctorRepository(db)
const appointmentRepo = new SqliteAppointmentRepository(db)
const patientRepo = new SqlitePatientRepository(db)

const router = fastify({
    logger: false
})

router.register(fastifyCors, {
    origin: true
})

HandleDoctor(router, appointmentRepo, doctorRepo)
HandleAppointment(router, appointmentRepo, patientRepo, doctorRepo)

const launchServer = async () => {
    try {
        await router.listen(8080)
    } catch (err) {
        router.log.error(err)
        process.exit(1)
    }
}

launchServer()
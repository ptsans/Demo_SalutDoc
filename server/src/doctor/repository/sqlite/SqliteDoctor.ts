import { Database } from 'sqlite3'
import { Doctor, DoctorRepository } from 'domain/Doctor'
import { UserId } from 'domain/RegularUser'

export class SqliteDoctorRepository implements DoctorRepository {
    protected conn: Database

    constructor(conn: Database) {
        this.conn = conn
    }

    GetAll(): Promise<Doctor[]> {
        return new Promise((resolve, reject) => {
            let query = `
                select id, name from doctor;
            `
            let doctors: Doctor[] = []
            this.conn.each(
                query,
                (error, row: { id: UserId, name: string }) => {
                    if (error) return reject(error)
                    const doctor: Doctor = {
                        id: row.id,
                        name: {
                            fullName: row.name
                        }
                    }
                    doctors.push(doctor)
                },
                () => {
                    return resolve(doctors)
                })
        })
    }

    GetById(id: UserId): Promise<Doctor> {
        return new Promise((resolve, reject) => {
            let query = `
                select id, name from doctor where id = ?;
            `

            this.conn.get(query, id, (error, row: { id: UserId, name: string }) => {
                if (error) return reject(error)
                const doctor: Doctor = {
                    id: row.id,
                    name: {
                        fullName: row.name
                    }
                }
                return resolve(doctor)
            })
        })
    }
}
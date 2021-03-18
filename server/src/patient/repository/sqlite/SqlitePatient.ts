import { Database } from 'sqlite3'
import { Patient, PatientRepository} from 'domain/Patient'
import { UserName } from 'domain/RegularUser'

export class SqlitePatientRepository implements PatientRepository{
    protected conn: Database

    constructor(conn: Database) {
        this.conn = conn
    }

    async Create(
        name: UserName
    ): Promise<Patient> {
        return new Promise<Patient>((resolve, reject) => {
            this.conn.run(
                `insert into patient (name) 
                     values              ($name);`,
                {
                    $name: name.fullName
                }, function (error) {
                    if (error) return reject(error)

                    const patient: Patient = {
                        id: this.lastID,
                        name
                    }

                    return resolve(patient)
                })
        })
    }
}
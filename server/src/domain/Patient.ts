import { RegularUser, UserName} from './RegularUser'

type Patient = RegularUser

interface PatientRepository {
    Create(
        name: UserName
    ): Promise<Patient>
}

export { Patient, PatientRepository }
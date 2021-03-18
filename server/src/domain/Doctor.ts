import { RegularUser, UserId } from './RegularUser'

type Doctor = RegularUser

interface DoctorRepository {
    GetAll(): Promise<Array<Doctor>>

    GetById(
        id: UserId
    ): Promise<Doctor>
}

export { Doctor, DoctorRepository }
import {useSWRInfinite} from 'swr'
import {Appointment} from 'domain/Appointment'

type DoctorsAppointmentsResponse = Promise<{
    data: Appointment[]
}>

const LIMIT = 15

const fetcher = async (url: string): Promise<Appointment[]> => fetch(url)
    .then(res => {
        if (!res.ok) {
            throw new Error('An error occurred while fetching the data.')
        }
        return res.json() as DoctorsAppointmentsResponse
    })
    .then(json => json.data)

const generateUrl = (doctorId: number, date: string, offset: number, limit: number): string => {
    return `http://127.0.0.1:8080/doctor/${doctorId}/appointments?date=${date}&offset=${offset}&limit=${limit}`
}

export default function useDoctorAppointments(doctorId: number, date: Date) {
    const formattedDate = date && `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`

    const { data, size, setSize, mutate } = useSWRInfinite(
        (pageIndex: number, previousPageData: Appointment[]|null) => {
        if (
            !doctorId || !formattedDate ||
            previousPageData && !previousPageData.length
        ) {
            return null
        }

        return generateUrl(doctorId, formattedDate, pageIndex * LIMIT, LIMIT)

    }, fetcher, {
        revalidateOnFocus: false
    })

    return {
        data,
        size,
        setSize,
        isEmpty: data?.[0]?.length === 0,
        mutate
    }
}
import useSWR from 'swr'
import {Time} from 'domain/Appointment'

type DoctorsResponse = Promise<{
    data: Time[]
}>

const fetcher = async (url: string, date: Date, doctorId: number): DoctorsResponse => {

    if (!doctorId) return null

    const params = new URLSearchParams({
        date: `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`,
        doctor: String(doctorId)
    })

    return fetch(`${url}?${params}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('An error occurred while fetching the data.')
            }
            return res.json()
        })
}

export default function useAppointmentTimes(
    date: Date, doctorId: number
): { openedTimes: Time[], isLoading: boolean, isError: Error, updateTimes: () => void } {

    const { data, error, mutate } = useSWR(['http://localhost:8080/appointment', date, doctorId], fetcher, {
        registerOnFocus: false
    })

    return {
        openedTimes: data?.data,
        isLoading: !error && !data,
        isError: error,
        updateTimes: mutate
    }
}
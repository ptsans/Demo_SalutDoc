import useSWR from 'swr'
import {Doctor} from 'domain/Doctor'

type DoctorsResponse = Promise<{
    data: Doctor[]
}>

const fetcher = async (url: string): DoctorsResponse => fetch(url).then(
    res => {
        if (!res.ok) {
            throw new Error('An error occurred while fetching the data.')
        }
        return res.json()
    })

export default function useDoctors(): { doctors: Doctor[], isLoading: boolean, isError: Error } {
    const { data, error } = useSWR(`http://localhost:8080/doctors`, fetcher, {
        registerOnFocus: false
    })

    return {
        doctors: data?.data,
        isLoading: !error && !data,
        isError: error
    }
}
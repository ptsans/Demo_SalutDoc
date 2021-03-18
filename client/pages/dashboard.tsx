import Box from 'components/ui/Box'
import Input from 'components/ui/Input'
import Select from 'components/ui/Select'
import DefaultLayout from 'layouts/DefaultLayout'
import Subtitle from 'components/ui/Subtitle'
import TextArea from 'components/ui/TextArea'
import Btn from 'components/ui/Btn'
import Link from 'next/link'
import Grid from 'components/dashboard/Grid'
import useDoctors from 'hooks/useDoctors'
import {useEffect, useState} from 'react'
import useDoctorAppointments from 'hooks/useDoctorAppointments'
import {formatInputDate, formatTime} from 'utils/format'

export default function DashboardPage() {
    const { doctors, isError, isLoading } = useDoctors()
    const [selectedDoctor, setSelectedDoctor] = useState(0)
    const [date, setDate] = useState(new Date())
    const [inputDate, setInputDate] = useState(formatInputDate(date))

    useEffect(() => {
        setInputDate(formatInputDate(date))
    }, [date])

    const { data, isEmpty, mutate } = useDoctorAppointments(doctors && doctors[selectedDoctor].id, date)

    const removeAppointment = (id: number) => {
        if (!doctors) return
        fetch(`http://127.0.0.1:8080/doctor/${doctors[selectedDoctor].id}/appointment/${id}`, {
            method: 'DELETE'
        })
            .then((response) => {
                if (response.ok) {
                    alert('Вы успешно удалили запись!')
                    return mutate()
                } else {
                    alert('Произошла ошибка, запись не удалена!')
                }
            })
    }

    if (!doctors || isLoading || isError) return null

    return (
        <DefaultLayout>
            <Link href='/'>
                <Btn label={'Move to Form'} />
            </Link>

            <Box>
                <Subtitle text="Врач:" />
                <Select
                    data={doctors}
                    datakey={'name.fullName'}
                    value={selectedDoctor}
                    onChangeOption={(doctor) => setSelectedDoctor(doctor)}
                />
            </Box>

            <Box>
                <Subtitle text={"Дата записей"} />
                <Input
                    id='date'
                    type='date'
                    value={inputDate}
                    onChange={(event) => {
                        setDate(new Date(event.target.value))
                    }}
                />
            </Box>

            {
                data && isEmpty && <Subtitle text={`На эту дату нет записей`} style={{justifySelf: 'center'}} />
            }

            {
                data && (
                    <Grid>
                        {
                            data.map((appointments) => {
                                return appointments.map((appointment) => {
                                    const { id, patient, date, complaints } = appointment
                                    const { time } = date
                                    return (
                                        <Box key={id}>
                                            <Subtitle
                                                text={patient.name.fullName}
                                            />
                                            <Subtitle text={formatTime(time.hours, time.minutes)} />
                                            <TextArea readOnly value={complaints} />
                                            <Btn label="отменить" onClick={() => removeAppointment(id)} />
                                        </Box>
                                    )
                                })
                            })
                        }
                    </Grid>
                )
            }

        </DefaultLayout>
    )
}
import {useEffect, useState} from 'react'
import Title from 'components/ui/Title'
import Box from 'components/ui/Box'
import Input from 'components/ui/Input'
import Select from 'components/ui/Select'
import DefaultLayout from 'layouts/DefaultLayout'
import Subtitle from 'components/ui/Subtitle'
import TextArea from 'components/ui/TextArea'
import Btn from 'components/ui/Btn'
import Link from 'next/link'
import useDoctors from 'hooks/useDoctors'
import useAppointmentTimes from 'hooks/useAppointmentTimes'
import {formatTime} from 'utils/format'

export default function FormPage() {
    const [patient, setPatient] = useState('')

    const [date] = useState(() => {
        const baseDate = new Date()
        baseDate.setDate(baseDate.getDate() + 1)
        return baseDate
    })

    function generateTimes() {
        const _time = new Date()
        _time.setHours(9, 0)

        return new Array(19).fill(null).map((value => {
            let hours = _time.getHours()
            let minutes = _time.getMinutes()
            _time.setMinutes(minutes + 30)
            return {
                hours,
                minutes,
                format: formatTime(hours, minutes)
            }
        }))
    }

    const [times, setTimes] = useState(generateTimes)

    const [selectedTime, setSelectedTime] = useState(0)

    const [complaints, setComplaints] = useState('')

    const { doctors, isError, isLoading } = useDoctors()
    const [selectedDoctor, setSelectedDoctor] = useState(0)

    const { openedTimes, updateTimes } = useAppointmentTimes(date, doctors && doctors[selectedDoctor]?.id)

    useEffect(() => {
        if (!openedTimes) return

        setTimes((prev) => {
            const next = generateTimes()
            for (const openedTimeItem of openedTimes) {
                const index = next.findIndex((time) => {
                    return (time.hours === openedTimeItem.hours) && (time.minutes === openedTimeItem.minutes)
                })
                next.splice(index, 1)
            }
            return next
        })
    }, [openedTimes])

    function isFormValid(): boolean {
        return (
            (patient.trim().length > 0)
        )
    }

    async function createAppointment() {
        if (!isFormValid()) return

        const response = await fetch('http://localhost:8080/appointment', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                patient,
                doctor: doctors[selectedDoctor].id,
                complaints,
                time: {
                    hours: times[selectedTime].hours,
                    minutes: times[selectedTime].minutes,
                },
                date: {
                    day: date.getDate(),
                    month: date.getMonth()+1,
                    year: date.getFullYear()
                }
            })
        })

        if (response.ok) {
            const json = await response.json()
            updateTimes()
            console.log(json)
            alert('Вы успешно добавили новую запись')
        }
    }

    if (isLoading || isError) return null

    return (
        <DefaultLayout>
            <Link href='/dashboard'>
                <Btn label={'Move to Dashboard'}/>
            </Link>

            <Box>
                <Title text="Форма для записи на прием" />
            </Box>

            <Box>
                <Input
                    id="patient_name"
                    label="Ваше ФИО:"
                    value={patient}
                    onChange={(event) => setPatient(event.target.value)}
                />
            </Box>

            <Box>
                <Subtitle text="Ваш лечащий врач:" />
                <Select
                    data={doctors}
                    datakey={'name.fullName'}
                    value={selectedDoctor}
                    onChangeOption={(doctor) => setSelectedDoctor(doctor)}
                />
            </Box>

            <Box>
                <Subtitle
                    text={`Запись на ${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`}
                />
                <Select
                    data={times}
                    datakey={'format'}
                    value={selectedTime}
                    onChangeOption={(time) => {setSelectedTime(time)}} />
            </Box>

            <Box>
                <Subtitle
                    text="Опишите ваши жалобы"
                />
                <TextArea
                    value={complaints}
                    onChange={(event) => setComplaints(event.target.value)}
                />
            </Box>

            <Btn
                label="записаться"
                disabled={!isFormValid()}
                onClick={createAppointment}
            />
        </DefaultLayout>
    )
}
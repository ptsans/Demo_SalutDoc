import { Date, Time } from 'domain/Appointment'

export const FormatDate = (date: Date): string => {
    const { year, month, day } = date
    let formatMonth = String(month)
    let formatDay = String(day)

    if (month < 10) {
        formatMonth = '0' + formatMonth
    }

    if (day < 10) {
        formatDay = '0' + formatDay
    }

    return `${year}-${formatMonth}-${formatDay}`
}

export const FormatTime = (time: Time): string => {
    const { hours, minutes } = time
    let formatHours = String(hours)
    let formatMinutes = String(minutes)

    if (hours < 10) {
        formatHours = '0' + formatHours
    }

    if (minutes < 10) {
        formatMinutes = '0' + formatMinutes
    }

    return `${formatHours}:${formatMinutes}`
}
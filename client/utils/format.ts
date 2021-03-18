export function formatTime(hours: number, minutes: number) {
    return `${hours < 10 ? '0'+hours: hours}:${minutes < 10 ? '0'+minutes: minutes}`
}

export function formatInputDate(date: Date): string {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return `${year}-${month < 10 ? '0'+month : month}-${day < 10 ? '0'+day : day}`
}
type UserId = number

type UserName = {
    fullName: string
}

type RegularUser = {
    id: UserId
    name: UserName
}

export { RegularUser, UserName, UserId }
export interface Entity {
    _id: string
    createdAt?: Date
}

export interface User extends Entity {
    email: string
    _id: string
    firstName: string
    lastName: string
    userName: string
    password: string

}

export interface Post extends Entity {
    title: string
    content: string
    authorId: string
    categories?: string[]
    customFields?: { name: string, value: any }[]
}

export interface Comment extends Entity {
    content: string
    authorId: string
    postId: string
}
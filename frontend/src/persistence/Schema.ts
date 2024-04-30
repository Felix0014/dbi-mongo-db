import Realm from 'realm-web'

export interface Entity {
    _id: Realm.BSON.ObjectId
}

export interface User extends Entity {
    email: string
    firstName: string
    lastName: string
    userName: string
    password: string

}

export interface Post extends Entity {
    title: string
    author: Realm.BSON.ObjectId
    description: string
    creationDate: Date
    editDates?: Date[]
    impressionCount: Realm.BSON.Long
    content?: { type: string, value: any }[]
    categories?: string[]
    commentsAllowed: boolean
}

export interface Comment extends Entity {
    content: string
    parent: Realm.BSON.ObjectId
    author: Realm.BSON.ObjectId
}
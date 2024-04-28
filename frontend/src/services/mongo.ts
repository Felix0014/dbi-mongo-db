import * as Realm from 'realm-web'

const APP_ID = "application-0-xtdpvmx"

export async function getMongoClient() {
    const app = new Realm.App({id: APP_ID})
    await app.logIn(Realm.Credentials.anonymous())
    const mongo = <globalThis.Realm.Services.MongoDB>app.currentUser?.mongoClient("mongodb-atlas")
    return mongo.db('Blog')
}
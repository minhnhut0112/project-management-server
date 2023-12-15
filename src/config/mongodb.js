import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environment'

let todolistDataBaseInstance = null

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect()

  todolistDataBaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

export const GET_DB = () => {
  if (!todolistDataBaseInstance) throw new Error('Must Connect to Database first!')
  return todolistDataBaseInstance
}

export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}

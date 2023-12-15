/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from './config/mongodb'
import { env } from './config/environment'

const START_SEREVR = () => {
  const app = express()

  app.get('/', (req, res) => {
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Server is running at http://${env.APP_HOST}:${env.APP_PORT}/`)
  })

  exitHook(() => {
    CLOSE_DB()
    console.log('Exit app. Goodbye!!')
  })
}

;(async () => {
  try {
    await CONNECT_DB()
    console.log('Connected to MongoDb!')
    START_SEREVR()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// CONNECT_DB()
//   .then(() => console.log('Connected to MongoDb'))
//   .then(() => START_SEREVR())
//   .catch((error) => {
//     console.error(error)
//     process.exit(0)
//   })

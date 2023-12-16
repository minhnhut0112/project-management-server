import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from './boardRoute'

const Router = express.Router()

Router.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'api v1'
  })
})

Router.use('/boards', boardRoute)

export const APIs_V1 = Router

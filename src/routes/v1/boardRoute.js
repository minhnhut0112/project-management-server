import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValodation } from '@/validations/boardValidation'
import { boardController } from '@/controllers/boardController'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({
      message: 'api get'
    })
  })
  .post(boardValodation.createNew, boardController.createNew)

export const boardRoute = Router

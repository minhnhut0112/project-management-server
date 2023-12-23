import express from 'express'
import { boardValodation } from '@/validations/boardValidation'
import { boardController } from '@/controllers/boardController'

const Router = express.Router()

Router.route('/').get(boardController.getAll).post(boardValodation.createNew, boardController.createNew)

Router.route('/:id')
  .get(boardController.getDetails)
  .put(boardValodation.updateColumnOrderIds, boardController.updateColumnOrderIds)

Router.route('/support/moving_card').put(
  boardValodation.moveCardToDifferentColunmn,
  boardController.moveCardToDifferentColunmn
)

export const boardRoute = Router

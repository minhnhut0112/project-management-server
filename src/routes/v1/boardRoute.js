import express from 'express'
import { boardValodation } from '@/validations/boardValidation'
import { boardController } from '@/controllers/boardController'

const Router = express.Router()

Router.route('/')
  .get(boardController.getAll)
  .post(boardValodation.createNew, boardController.createNew)

Router.route('/:id')
  .get(boardController.getDetails)
  .put(boardValodation.updateBoard, boardController.updateColumnOrderIds)

Router.route('/:id/labels')
  .put(boardController.editLabel)
  .post(boardController.createNewLabel)
  .delete(boardController.deleteLabel)

Router.route('/support/moving_card').put(
  boardValodation.moveCardToDifferentColunmn,
  boardController.moveCardToDifferentColunmn
)

Router.route('/invite').post(boardController.sendInviteEmail)

Router.route('/invite/:id').put(boardController.confirmInviteEmail).get(boardController.getInvite)

export const boardRoute = Router

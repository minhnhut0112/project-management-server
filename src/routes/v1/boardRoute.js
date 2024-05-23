import express from 'express'
import { boardValodation } from '@/validations/boardValidation'
import { boardController } from '@/controllers/boardController'
import { upload } from '@/middlewares/fileMiddleware'

const Router = express.Router()

Router.route('/').post(boardValodation.createNew, boardController.createNew)

Router.route('/getAll/:id').get(boardController.getAll)
Router.route('/getAllClose/:id').get(boardController.getAllClose)

Router.route('/:id')
  .get(boardController.getDetails)
  .put(boardValodation.updateBoard, boardController.updateColumnOrderIds)
  .delete(boardController.deleteBoard)

Router.route('/:id/archive').get(boardController.getArchiveCardAndList)

Router.route('/:id/labels')
  .put(boardController.editLabel)
  .post(boardController.createNewLabel)
  .delete(boardController.deleteLabel)

Router.route('/:id/cover').post(upload.single('file'), boardController.uploadCover)

Router.route('/:id/permission')
  .put(boardController.changeToAdmin)
  .post(boardController.changeToMember)
  .delete(boardController.removeFromBoard)

Router.route('/support/moving_card').put(
  boardValodation.moveCardToDifferentColunmn,
  boardController.moveCardToDifferentColunmn
)

Router.route('/:id/issues')
  .post(boardController.createNewIssue)
  .put(boardController.updateIssue)
  .patch(boardController.editIssue)

Router.route('/:id/issues').post(boardController.createNewIssue).put(boardController.updateIssue)

Router.route('/invite').post(boardController.sendInviteEmail)

Router.route('/invite/:id').put(boardController.confirmInviteEmail).get(boardController.getInvite)

export const boardRoute = Router

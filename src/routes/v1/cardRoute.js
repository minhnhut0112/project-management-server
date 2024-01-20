import express from 'express'
import { cardValodation } from '@/validations/cardValidation'
import { cardController } from '@/controllers/cardController'
import { upload } from '@/middlewares/fileMiddleware'

const Router = express.Router()

Router.route('/').post(cardValodation.createNew, cardController.createNew)

Router.route('/:id')
  .put(cardValodation.updateCard, cardController.updateCard)
  .delete(cardValodation.deleteCard, cardController.deleteCard)

Router.route('/:id/cover')
  .post(upload.single('file'), cardController.updateCover)
  .delete(cardValodation.updateCard, cardController.removeCover)

Router.route('/:id/dates')
  .put(cardValodation.updateCard, cardController.updateDates)
  .delete(cardValodation.updateCard, cardController.removeDates)

Router.route('/:id/attachments')
  .post(upload.single('file'), cardController.uploadAttachments)
  .put(cardValodation.updateCard, cardController.removeAttachments)

Router.route('/:id/labels').get(cardController.getAllLabelsByBoardId)
// .post(cardController.updateCard, cardController.updateLabel)
// .put(cardValodation.updateCard, cardController.removeFile)

Router.route('/:id/checklist')
  .post(cardController.createChecklist)
  .put(cardValodation.updateCard, cardController.updateCheckList)

// Router.route('/:id/comments')
//   .post(cardController.updateCard, cardController.fileUploads)
//   .put(cardValodation.updateCard, cardController.removeFile)

export const cardRoute = Router

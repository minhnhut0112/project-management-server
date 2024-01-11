import express from 'express'
import { cardValodation } from '@/validations/cardValidation'
import { cardController } from '@/controllers/cardController'
import { upload } from '@/middlewares/fileMiddleware'

const Router = express.Router()

Router.route('/').post(cardValodation.createNew, cardController.createNew)

Router.route('/:id')
  .put(cardValodation.updateCard, cardController.updateCard)
  .delete(cardValodation.deleteCard, cardController.deleteCard)
  .post(upload.single('file'), cardController.updateCover)

Router.route('/removeItem/:id').post(cardValodation.deleteCard, cardController.unsetField)

Router.route('/:id/upload').post(upload.single('file'), cardController.fileUploads)

export const cardRoute = Router

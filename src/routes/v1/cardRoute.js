import express from 'express'
import { cardValodation } from '@/validations/cardValidation'
import { cardController } from '@/controllers/cardController'
import { upload } from '@/middlewares/fileMiddleware'
import {
  verifyTokenAndUserAuthorizationToCard,
  verifyTokenAndUAdminAuthorizationToCard,
  verifyToken
} from '@/middlewares/authorityMiddleware'

const Router = express.Router()

Router.route('/').post(verifyToken, cardValodation.createNew, cardController.createNew)

Router.route('/:id')
  .put(cardValodation.updateCard, cardController.updateCard)
  .delete(
    verifyTokenAndUAdminAuthorizationToCard,
    cardValodation.deleteCard,
    cardController.deleteCard
  )

Router.route('/:id/cover')
  .post(verifyTokenAndUserAuthorizationToCard, upload.single('file'), cardController.updateCover)
  .delete(
    verifyTokenAndUserAuthorizationToCard,
    cardValodation.updateCard,
    cardController.removeCover
  )

Router.route('/:id/comments').post(
  verifyTokenAndUserAuthorizationToCard,
  cardController.createComment
)

Router.route('/:id/dates')
  .put(verifyTokenAndUserAuthorizationToCard, cardValodation.updateCard, cardController.updateDates)
  .delete(
    verifyTokenAndUserAuthorizationToCard,
    cardValodation.updateCard,
    cardController.removeDates
  )

Router.route('/:id/attachments')
  .post(
    verifyTokenAndUserAuthorizationToCard,
    upload.single('file'),
    cardController.uploadAttachments
  )
  .put(
    verifyTokenAndUserAuthorizationToCard,
    cardValodation.updateCard,
    cardController.removeAttachments
  )

Router.route('/:id/checklist')
  .post(verifyTokenAndUserAuthorizationToCard, cardController.createChecklist)
  .put(
    verifyTokenAndUserAuthorizationToCard,
    cardValodation.updateCard,
    cardController.updateCheckList
  )

export const cardRoute = Router

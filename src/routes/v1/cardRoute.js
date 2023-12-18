import express from 'express'
import { cardValodation } from '@/validations/cardValidation'
import { cardController } from '@/controllers/cardController'

const Router = express.Router()

Router.route('/').post(cardValodation.createNew, cardController.createNew)

// Router.route('/:id').get(cardController.getDetails).put()

export const cardRoute = Router

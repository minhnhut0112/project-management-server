import express from 'express'
import { columnValodation } from '@/validations/columnValidation'
import { columnController } from '@/controllers/columnController'

const Router = express.Router()

Router.route('/').post(columnValodation.createNew, columnController.createNew)

// Router.route('/:id').get(columnController.getDetails).put()

export const columnRoute = Router

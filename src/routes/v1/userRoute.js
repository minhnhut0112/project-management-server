import { userController } from '@/controllers/userController'
import { userValidation } from '@/validations/userValidation'
import express from 'express'

const Router = express.Router()

Router.route('/signin').post(userValidation.signinValidation, userController.signIn)
Router.route('/signup').post()
Router.route('/signout').post()

export const userRoute = Router

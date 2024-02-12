import { userController } from '@/controllers/userController'
import { userValidation } from '@/validations/userValidation'
import express from 'express'

const Router = express.Router()

Router.route('/').get(userController.findUSer)

Router.route('/signin').post(userValidation.signinValidation, userController.signIn)
Router.route('/signup').post(userValidation.signupValidation, userController.signUp)
Router.route('/refreshtoken').post(userController.refreshToken)
Router.route('/signout').post()

Router.route('/:id').get(userController.getUser)

export const userRoute = Router

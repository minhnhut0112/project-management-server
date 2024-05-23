import { userController } from '@/controllers/userController'
import { upload } from '@/middlewares/fileMiddleware'
import { userValidation } from '@/validations/userValidation'
import express from 'express'

const Router = express.Router()

Router.route('/').get(userController.getAllUser)

Router.route('/finduser').post(userController.findUSer)

Router.route('/starred/:id')
  .post(userController.updateStarredBoard)
  .put(userController.removeStarredBoard)
  .get(userController.getStarredBoard)

Router.route('/recent/:id')
  .post(userController.updateRecentBoard)
  .get(userController.getRecentBoard)

Router.route('/signin').post(userValidation.signinValidation, userController.signIn)
Router.route('/signup').post(userValidation.signupValidation, userController.signUp)
Router.route('/refreshtoken').post(userController.refreshToken)
Router.route('/signout').post()

Router.route('/:id')
  .get(userController.getUser)
  .put(userController.updateUser)
  .post(upload.single('file'), userController.updateAvatar)

export const userRoute = Router

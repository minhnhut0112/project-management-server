import { userService } from '@/services/userService'
import { jwtUtils } from '@/utils/jwt'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await userService.authenticateUser(email, password)

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const validPassword = password === user.password

    if (!validPassword) {
      return res.status(404).json('Incorrect password')
    }

    if (user && validPassword) {
      const accessToken = jwtUtils.generateAccessToken(user._id)
      const refreshToken = jwtUtils.generateRefreshToken(user._id)

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/'
      })
      // eslint-disable-next-line no-unused-vars
      const { password, ...others } = user
      res.status(StatusCodes.OK).json({ ...others, accessToken })
    }
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) return res.status(401).json('You are not authenticated')

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      const newAccessToken = jwtUtils.generateAccessToken(user.id)
      const newRefreshToken = jwtUtils.generateRefreshToken(user.id)

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict'
      })

      res.status(StatusCodes.OK).json({
        accessToken: newAccessToken
      })
    })
  } catch (error) {
    next(error)
  }
}

export const userController = {
  signIn,
  refreshToken
}

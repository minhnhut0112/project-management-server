import { userService } from '@/services/userService'
import { jwtUtils } from '@/utils/jwt'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await userService.authenticateUser(email, password)

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const validPassword = bcrypt.compareSync(password, user.password)

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

const signUp = async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body
    const newUser = await userService.signUp(email, password, fullName)
    res.status(StatusCodes.OK).json(newUser)
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

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id
    if (!userId) return res.status(StatusCodes.NOT_FOUND)
    const user = await userService.getUser(userId)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

const getAllUser = async (req, res, next) => {
  try {
    const users = await userService.getAllUser()
    res.status(StatusCodes.OK).json(users)
  } catch (error) {
    next(error)
  }
}

const findUSer = async (req, res, next) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Query parameter is required' })
    }

    const results = await userService.findUSer(email)
    res.json(results)
  } catch (error) {
    next(error)
  }
}

const updateUser = async (req, res, next) => {
  try {
    const result = await userService.updateUser(req.params.id, req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateAvatar = async (req, res, next) => {
  try {
    const uploadAvatar = await userService.updateAvatar(req.params.id, req.file)

    global.io.emit('updatecover')

    res.status(StatusCodes.OK).json(uploadAvatar)
  } catch (error) {
    next(error)
  }
}

const updateStarredBoard = async (req, res, next) => {
  try {
    const result = await userService.updateStarredBoard(req.params.id, req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const removeStarredBoard = async (req, res, next) => {
  try {
    const result = await userService.removeStarredBoard(req.params.id, req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getStarredBoard = async (req, res, next) => {
  try {
    const result = await userService.getStarredBoard(req.params.id)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateRecentBoard = async (req, res, next) => {
  try {
    const result = await userService.updateRecentBoard(req.params.id, req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getRecentBoard = async (req, res, next) => {
  try {
    const result = await userService.getRecentBoard(req.params.id)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  signIn,
  refreshToken,
  getUser,
  signUp,
  findUSer,
  updateStarredBoard,
  removeStarredBoard,
  getStarredBoard,
  updateRecentBoard,
  getRecentBoard,
  getAllUser,
  updateUser,
  updateAvatar
}

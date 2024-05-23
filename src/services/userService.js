/* eslint-disable no-unused-vars */
import { usernModel } from '@/models/userModel'
import ApiError from '@/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'
import {
  generateRandomColor,
  generateUniqueUsername,
  generateUsernameFromEmail
} from '@/utils/formatters'
import { ObjectId } from 'mongodb'
import { boardModel } from '@/models/boardModel'

const authenticateUser = async (email, password) => {
  try {
    const user = await usernModel.findOneByEmail(email)

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    return user
  } catch (error) {
    throw error
  }
}

const signUp = async (email, password, fullName) => {
  try {
    const checkEmail = await usernModel.findOneByEmail(email)

    if (checkEmail) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!')
    }

    let username = generateUsernameFromEmail(email)

    let checkUsername = await usernModel.findOneByUsername(username)
    let usernameConflictCounter = 1

    while (checkUsername) {
      username = generateUniqueUsername(username, usernameConflictCounter)
      checkUsername = await usernModel.findOneByUsername(username)
      usernameConflictCounter += 1
    }

    const saltRounds = 10
    const hashPassword = bcrypt.hashSync(password, saltRounds)

    const avatarColor = generateRandomColor()

    const dataToCreate = {
      email,
      username: username,
      password: hashPassword,
      avatarColor: avatarColor,
      fullName: fullName
    }

    const newUSer = await usernModel.createNew(dataToCreate)

    const getNewUser = await usernModel.findOneById(newUSer.insertedId)

    return getNewUser
  } catch (error) {
    throw error
  }
}

const getUser = async (userId) => {
  try {
    const user = await usernModel.findOneById(userId)

    if (user) {
      return user
    }

    return null
  } catch (error) {
    throw error
  }
}

const getAllUser = async () => {
  try {
    const users = await usernModel.getAllUsers()
    return users
  } catch (error) {
    throw error
  }
}

const findUSer = async (email) => {
  try {
    const users = await usernModel.findUser(email)

    const filteredUsers = users.map((user) => ({
      avatar: user?.avatar,
      username: user?.username,
      avatarColor: user?.avatarColor
    }))
    return filteredUsers
  } catch (error) {
    throw error
  }
}

const updateStarredBoard = async (id, boardId) => {
  try {
    const itemToPush = {
      starredIds: new ObjectId(boardId.boardId)
    }
    const result = await usernModel.pushItem(id, itemToPush)

    return result
  } catch (error) {
    throw error
  }
}

const removeStarredBoard = async (id, boardId) => {
  try {
    const itemToPull = {
      starredIds: new ObjectId(boardId.boardId)
    }
    const result = await usernModel.pullItem(id, itemToPull)

    return result
  } catch (error) {
    throw error
  }
}

const getStarredBoard = async (id) => {
  try {
    const user = await usernModel.findOneById(id)

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }

    const boardIds = user?.starredIds

    const starredBoard = await boardModel.getBoardByBoardIds(boardIds)

    return starredBoard
  } catch (error) {
    throw error
  }
}

const updateRecentBoard = async (id, boardId) => {
  try {
    const itemToPush = {
      recentIds: new ObjectId(boardId.boardId)
    }
    const result = await usernModel.pushItem(id, itemToPush)

    return result
  } catch (error) {
    throw error
  }
}

const getRecentBoard = async (id) => {
  try {
    const user = await usernModel.findOneById(id)

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }

    const boardIds = user?.recentIds

    const starredBoard = await boardModel.getBoardByBoardIds(boardIds)

    return starredBoard
  } catch (error) {
    throw error
  }
}

const updateUser = async (id, data) => {
  try {
    const result = await usernModel.updateUser(id, data)

    return result
  } catch (error) {
    throw error
  }
}

const updateAvatar = async (id, data) => {
  try {
    const updateData = {
      avatar: `http://localhost:8017/uploads/${data.filename}`
    }

    const updatedUser = await usernModel.updateUser(id, updateData)

    return updatedUser
  } catch (error) {
    throw error
  }
}

export const userService = {
  authenticateUser,
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

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

const signUp = async (email, password) => {
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
      avatarColor: avatarColor
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

const findUSer = async (username, email) => {
  try {
    const results = await usernModel.findUser(username, email)
    return results
  } catch (error) {
    throw error
  }
}

export const userService = {
  authenticateUser,
  getUser,
  signUp,
  findUSer
}

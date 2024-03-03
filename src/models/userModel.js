import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '@/config/mongodb'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().min(8).required(),
  avatarColor: Joi.string().required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    return await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByEmail = async (email) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      email: email
    })
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByUsername = async (username) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      username: username
    })
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id)
      })
  } catch (error) {
    throw new Error(error)
  }
}

const findUser = async (username, email) => {
  try {
    if (!username && !email) {
      throw new Error('At least one of username or email must be provided')
    }

    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .find({
        $or: [
          username && { username: { $regex: username, $options: 'i' } },
          email && { email: { $regex: email, $options: 'i' } }
        ].filter(Boolean)
      })
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const findMember = async (memberIds) => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .find({ _id: { $in: memberIds } })
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

export const usernModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneByEmail,
  findOneById,
  findOneByUsername,
  findUser,
  findMember
}

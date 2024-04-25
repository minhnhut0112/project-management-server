import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '@/utils/validators'
import { GET_DB } from '@/config/mongodb'
import { ObjectId } from 'mongodb'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'
import { defaultLabels } from '@/utils/constants'

const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  cover: Joi.string().required(),
  slug: Joi.string().required().min(3).trim().strict(),
  type: Joi.string().valid('public', 'private').required(),
  ownerId: Joi.required(),
  members: Joi.array().items(Joi.string()).default([]),
  admins: Joi.array().default([]),
  issues: Joi.array().default([]),
  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  labels: Joi.array().default(defaultLabels),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData)
  } catch (error) {
    throw new Error(error)
  }
}

const getAll = async (userId) => {
  try {
    const cursor = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .find({
        $and: [
          {
            $or: [
              { ownerId: new ObjectId(userId) },
              { members: new ObjectId(userId) },
              { admins: new ObjectId(userId) }
            ]
          },
          { _destroy: false }
        ]
      })
    const result = await cursor.toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    return await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id)
      })
  } catch (error) {
    throw new Error(error)
  }
}

const getDetails = async (id) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id)
          }
        },
        {
          $lookup: {
            from: columnModel.COLUMN_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'columns'
          }
        },
        {
          $lookup: {
            from: cardModel.CARD_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'cards'
          }
        }
      ])
      .toArray()
    return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}

const pushItem = async (id, data) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(id)
        },
        {
          $push: data
        },
        { returnDocument: 'after' }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const pullItem = async (id, data) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(id)
        },
        {
          $pull: data
        },
        { returnDocument: 'after' }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateBoard = async (id, data) => {
  try {
    Object.keys(data).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete data[fieldName]
      }
    })

    if (data.columnOrderIds) {
      data.columnOrderIds = data.columnOrderIds.map((_id) => new ObjectId(_id))
    }

    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(id)
        },
        {
          $set: data
        },
        { returnDocument: 'after' }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateLabel = async (id, data) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(id),
          'labels._id': new ObjectId(data.labelEdited._id)
        },
        {
          $set: {
            'labels.$.bgColor': data.labelEdited.bgColor,
            'labels.$.labelTitle': data.labelEdited.labelTitle
          }
        },
        { returnDocument: 'after' }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateIssue = async (id, data) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(id),
          'issues._id': new ObjectId(data.issue._id)
        },
        {
          $push: {
            'issues.$.comments': { ...data.issue.comment }
          }
        },
        { returnDocument: 'after' }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const editIssue = async (id, data) => {
  try {
    const updateQuery = {}

    if (data.issue.title) {
      updateQuery['issues.$.title'] = data.issue.title
    }

    if (data.issue.opened !== undefined) {
      updateQuery['issues.$.opened'] = data.issue.opened
    }

    if (Object.keys(updateQuery).length > 0) {
      const result = await GET_DB()
        .collection(BOARD_COLLECTION_NAME)
        .findOneAndUpdate(
          {
            _id: new ObjectId(id),
            'issues._id': new ObjectId(data.issue._id)
          },
          {
            $set: updateQuery
          },
          { returnDocument: 'after' }
        )
      return result
    } else {
      return null
    }
  } catch (error) {
    throw new Error(error)
  }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushItem,
  updateBoard,
  pullItem,
  getAll,
  updateLabel,
  updateIssue,
  editIssue
}

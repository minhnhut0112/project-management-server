/* eslint-disable no-useless-catch */

import { cardModel } from '@/models/cardModel'
import { columnModel } from '@/models/columnModel'
import ApiError from '@/utils/ApiError'
import { allowedImageTypes } from '@/utils/constants'
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import fs from 'fs'
import path from 'path'
import { usernModel } from '@/models/userModel'

const createNew = async (data, userId) => {
  try {
    const newCard = {
      ...data
    }

    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard)
    }

    const currentUser = await usernModel.findOneById(userId)

    const itemToPush = {
      activitys: {
        _id: new ObjectId(),
        userId: new ObjectId(userId),
        avatar: currentUser.avatar,
        username: currentUser.username,
        fullname: currentUser.fullname,
        avatarColor: currentUser.avatarColor,
        description: 'Created this card',
        timestamp: new Date().valueOf()
      }
    }

    await cardModel.pushItem(createdCard.insertedId, itemToPush)

    return getNewCard
  } catch (error) {
    throw error
  }
}

const updateCard = async (id, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    }

    const updatedCard = await cardModel.updateCard(id, updateData)

    return updatedCard
  } catch (error) {
    throw error
  }
}

const deleteCard = async (id) => {
  try {
    const targetCard = await cardModel.findOneById(id)

    if (!targetCard) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found!')
    }

    const uploadDir = './src/public/uploads/'
    targetCard.attachments.forEach((attachment) => {
      const fileName = attachment.path.substring(attachment.path.lastIndexOf('/') + 1)
      const filePath = path.join(uploadDir, fileName)

      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            throw new ApiError(
              StatusCodes.INTERNAL_SERVER_ERROR,
              'Error deleting file: ' + err.message
            )
          }
        })
      } else {
        throw new ApiError(StatusCodes.NOT_FOUND, 'File not found!')
      }
    })

    await cardModel.deleteOneById(id)

    await columnModel.pullCardOrderIds(targetCard)

    return { deleteResult: 'Card and its card deleted successfully! ' }
  } catch (error) {
    throw error
  }
}

const updateCover = async (id, file, userId) => {
  try {
    const cover = {
      cover: `http://localhost:8017/uploads/${file.filename}`
    }

    const encodedFilename = encodeURIComponent(file.originalname)

    const updateData = {
      attachments: {
        _id: new ObjectId(),
        fileName: encodedFilename,
        type: file.mimetype,
        path: `http://localhost:8017/uploads/${file.filename}`,
        createAt: Date.now()
      }
    }

    const updatedCover = await cardModel.updateCard(id, cover)

    await cardModel.pushItem(id, updateData)

    const currentUser = await usernModel.findOneById(userId)

    const itemToPush = {
      activitys: {
        _id: new ObjectId(),
        userId: new ObjectId(userId),
        avatar: currentUser.avatar,
        username: currentUser.username,
        fullname: currentUser.fullname,
        avatarColor: currentUser.avatarColor,
        description: `Set ${file.filename} as the cover to this card`,
        timestamp: new Date().valueOf()
      }
    }

    await cardModel.pushItem(id, itemToPush)

    return updatedCover
  } catch (error) {
    throw error
  }
}

const unsetCocver = async (id, userId) => {
  try {
    const field = 'cover'
    await cardModel.unsetField(id, field)

    const currentUser = await usernModel.findOneById(userId)

    const itemToPush = {
      activitys: {
        _id: new ObjectId(),
        userId: new ObjectId(userId),
        avatar: currentUser.avatar,
        username: currentUser.username,
        fullname: currentUser.fullname,
        avatarColor: currentUser.avatarColor,
        description: 'Delete the card cover',
        timestamp: new Date().valueOf()
      }
    }

    await cardModel.pushItem(id, itemToPush)

    return { result: 'Remove Cover is successfully!' }
  } catch (error) {
    throw error
  }
}

const updateDates = async (id, data, userId) => {
  try {
    const currentUser = await usernModel.findOneById(userId)

    const itemToPush = {
      activitys: {
        _id: new ObjectId(),
        userId: new ObjectId(userId),
        avatar: currentUser.avatar,
        username: currentUser.username,
        fullname: currentUser.fullname,
        avatarColor: currentUser.avatarColor,
        description: 'Updated dates to this card',
        timestamp: new Date().valueOf()
      }
    }

    await cardModel.pushItem(id, itemToPush)

    const dataUpdate = {
      dateTime: {
        ...data
      }
    }

    const updatedCard = await cardModel.updateCard(id, dataUpdate)

    return updatedCard
  } catch (error) {
    throw error
  }
}

const unsetDates = async (id, userId) => {
  try {
    const field = 'dateTime'
    await cardModel.unsetField(id, field)

    const currentUser = await usernModel.findOneById(userId)

    const itemToPush = {
      activitys: {
        _id: new ObjectId(),
        userId: new ObjectId(userId),
        avatar: currentUser.avatar,
        username: currentUser.username,
        fullname: currentUser.fullname,
        avatarColor: currentUser.avatarColor,
        description: 'Deleted dates to this card',
        timestamp: new Date().valueOf()
      }
    }

    await cardModel.pushItem(id, itemToPush)

    return { result: 'Remove Dates is successfully!' }
  } catch (error) {
    throw error
  }
}

const uploadAttachments = async (id, data, userId) => {
  try {
    const encodedFilename = encodeURIComponent(data.originalname)

    const updateData = {
      attachments: {
        _id: new ObjectId(),
        fileName: encodedFilename,
        type: data.mimetype,
        path: `http://localhost:8017/uploads/${data.filename}`,
        createAt: Date.now()
      }
    }

    const card = await cardModel.findOneById(id)

    if (!card.cover && allowedImageTypes.includes(data.mimetype)) {
      const cover = { cover: `http://localhost:8017/uploads/${data.filename}` }
      await cardModel.updateCard(id, cover)
    }

    const updatedCard = await cardModel.pushItem(id, updateData)

    const currentUser = await usernModel.findOneById(userId)

    const itemToPush = {
      activitys: {
        _id: new ObjectId(),
        userId: new ObjectId(userId),
        avatar: currentUser.avatar,
        username: currentUser.username,
        fullname: currentUser.fullname,
        avatarColor: currentUser.avatarColor,
        description: `Attached ${data.filename} to this card`,
        timestamp: new Date().valueOf()
      }
    }

    await cardModel.pushItem(id, itemToPush)

    return updatedCard
  } catch (error) {
    throw error
  }
}

const removeAttachments = async (id, data, userId) => {
  try {
    const card = await cardModel.findOneById(id)

    const targetAttachment = card.attachments.find(
      (attachment) => attachment._id == data.attachment._id
    )

    const url = targetAttachment.path

    const uploadDir = './src/public/uploads/'

    const fileName = url.substring(url.lastIndexOf('/') + 1)

    const filePath = path.join(uploadDir, fileName)

    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Error deleting file: ' + err.message
          )
        }
      })
    } else {
      throw new ApiError(StatusCodes.NOT_FOUND, 'File not found!')
    }

    const itemToPull = {
      attachments: {
        _id: new ObjectId(targetAttachment._id)
      }
    }

    await cardModel.pullItem(id, itemToPull)

    const currentUser = await usernModel.findOneById(userId)

    const itemToPush = {
      activitys: {
        _id: new ObjectId(),
        userId: new ObjectId(userId),
        avatar: currentUser.avatar,
        username: currentUser.username,
        fullname: currentUser.fullname,
        avatarColor: currentUser.avatarColor,
        description: `deleted the ${targetAttachment.fileName} attachment from this card`,
        timestamp: new Date().valueOf()
      }
    }

    await cardModel.pushItem(id, itemToPush)

    return { result: 'Remove Attachments is successfully!' }
  } catch (error) {
    throw error
  }
}

const createChecklist = async (cardId, checklist, userId) => {
  try {
    const datatoUpdate = {
      checklist: { _id: new ObjectId(), title: checklist.checklistTitle, items: [] }
    }
    const newchecklist = await cardModel.pushItem(cardId, datatoUpdate)

    const currentUser = await usernModel.findOneById(userId)

    const itemToPush = {
      activitys: {
        _id: new ObjectId(),
        userId: new ObjectId(userId),
        avatar: currentUser.avatar,
        username: currentUser.username,
        fullname: currentUser.fullname,
        avatarColor: currentUser.avatarColor,
        description: `added ${checklist.checklistTitle} to this card`,

        timestamp: new Date().valueOf()
      }
    }

    await cardModel.pushItem(cardId, itemToPush)

    return newchecklist
  } catch (error) {
    throw error
  }
}

const updateCheckList = async (cardId, checklist) => {
  try {
    const updatedCheckList = await cardModel.updateCheckList(cardId, checklist)
    return updatedCheckList
  } catch (error) {
    throw error
  }
}

const createComment = async (cardId, message) => {
  try {
    const card = await cardModel.findOneById(cardId)

    if (!card) {
      throw new Error('Card not found')
    }

    const dataToUpdate = {
      comments: { _id: new ObjectId(), ...message }
    }

    const newComment = await cardModel.pushItem(cardId, dataToUpdate)

    return newComment
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew,
  updateCard,
  deleteCard,
  uploadAttachments,
  updateCover,
  unsetCocver,
  removeAttachments,
  updateDates,
  unsetDates,
  createChecklist,
  updateCheckList,
  createComment
}

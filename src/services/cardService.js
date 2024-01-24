/* eslint-disable no-useless-catch */

import { cardModel } from '@/models/cardModel'
import { columnModel } from '@/models/columnModel'
import ApiError from '@/utils/ApiError'
import { allowedImageTypes } from '@/utils/constants'
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import fs from 'fs'
import path from 'path'

const createNew = async (data) => {
  try {
    const newCard = {
      ...data
    }

    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard)
    }

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

    await cardModel.deleteOneById(id)

    await columnModel.pullCardOrderIds(targetCard)

    return { deleteResult: 'Card and its card deleted successfully! ' }
  } catch (error) {
    throw error
  }
}

const updateCover = async (id, file) => {
  try {
    const cover = {
      cover: `http://localhost:8017/uploads/${file.filename}`
    }

    const encodedFilename = encodeURIComponent(file.originalname)

    const updateData = {
      attachment: {
        _id: new ObjectId(),
        fileName: encodedFilename,
        type: file.mimetype,
        path: `http://localhost:8017/uploads/${file.filename}`,
        createAt: Date.now()
      }
    }

    const updatedCover = await cardModel.updateCard(id, cover)

    await cardModel.pushItem(id, updateData)

    return updatedCover
  } catch (error) {
    throw error
  }
}

const unsetCocver = async (id) => {
  try {
    const field = 'cover'
    await cardModel.unsetField(id, field)

    return { result: 'Remove Cover is successfully!' }
  } catch (error) {
    throw error
  }
}

const updateDates = async (id, data) => {
  try {
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

const unsetDates = async (id) => {
  try {
    const field = 'dateTime'
    await cardModel.unsetField(id, field)

    return { result: 'Remove Dates is successfully!' }
  } catch (error) {
    throw error
  }
}

const uploadAttachments = async (id, data) => {
  try {
    const encodedFilename = encodeURIComponent(data.originalname)

    const updateData = {
      attachment: {
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

    return updatedCard
  } catch (error) {
    throw error
  }
}

const removeAttachments = async (id, data) => {
  try {
    const card = await cardModel.findOneById(id)

    const targetAttachment = card.attachment.find((attachment) => attachment._id == data.attachment._id)

    const url = targetAttachment.path

    if (url == card.cover) {
      const data = {
        field: 'cover'
      }
      await cardModel.unsetField(id, data)
    }

    const uploadDir = './src/public/uploads/'

    const fileName = url.substring(url.lastIndexOf('/') + 1)

    const filePath = path.join(uploadDir, fileName)

    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          throw new ApiError()
        }
      })
    } else {
      throw new ApiError(StatusCodes.NOT_FOUND, 'File not found!')
    }

    const itemToPull = {
      attachment: {
        ...targetAttachment
      }
    }

    await cardModel.pullItem(id, itemToPull)

    return { result: 'Remove Attachments is successfully!' }
  } catch (error) {
    throw error
  }
}

const getAllLabelsByBoardId = async (boardId) => {
  try {
    return await cardModel.findAllLabelsByBoardId(boardId)
  } catch (error) {
    throw error
  }
}

const createChecklist = async (cardId, checklist) => {
  try {
    const datatoUpdate = {
      checklist: { _id: new ObjectId(), title: checklist.checklistTitle, items: [] }
    }
    const newchecklist = await cardModel.pushItem(cardId, datatoUpdate)
    return newchecklist
  } catch (error) {
    throw error
  }
}

const updateCheckList = async (cardId, checklist) => {
  console.log('🚀 ~ updateCheckList ~ cardId, checklist:', cardId, checklist)
  try {
    const updatedCheckList = await cardModel.updateCheckList(cardId, checklist)
    return updatedCheckList
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
  getAllLabelsByBoardId,
  createChecklist,
  updateCheckList
}

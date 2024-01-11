/* eslint-disable no-useless-catch */

import { cardModel } from '@/models/cardModel'
import { columnModel } from '@/models/columnModel'
import ApiError from '@/utils/ApiError'
import { allowedImageTypes } from '@/utils/constants'
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'

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

const updateCover = async (id, file) => {
  try {
    const cover = {
      cover: `http://localhost:8017/uploads/${file.filename}`
    }

    const encodedFilename = encodeURIComponent(file.originalname)

    const updateData = {
      _id: new ObjectId(),
      fileName: encodedFilename,
      type: file.mimetype,
      path: `http://localhost:8017/uploads/${file.filename}`,
      createAt: Date.now()
    }

    const updatedCover = await cardModel.updateCard(id, cover)

    await cardModel.pushAttachment(id, updateData)

    return updatedCover
  } catch (error) {
    throw error
  }
}

const unsetCocver = async (id, field) => {
  try {
    const updatedCard = await cardModel.unsetField(id, field)

    return updatedCard
  } catch (error) {
    throw error
  }
}

const fileUploads = async (id, data) => {
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

export const cardService = {
  createNew,
  updateCard,
  deleteCard,
  fileUploads,
  updateCover,
  unsetCocver
}

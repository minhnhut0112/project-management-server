/* eslint-disable no-useless-catch */

import { boardModel } from '@/models/boardModel'
import { cardModel } from '@/models/cardModel'
import { columnModel } from '@/models/columnModel'
import ApiError from '@/utils/ApiError'
import { slugify } from '@/utils/formatters'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

const createNew = async (data) => {
  try {
    const newBoard = {
      ...data,
      slug: slugify(data.title)
    }

    const createdBoard = await boardModel.createNew(newBoard)

    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getAll = async () => {
  try {
    return await boardModel.getAll()
  } catch (error) {
    throw error
  }
}

const getDetails = async (id) => {
  try {
    const board = await boardModel.getDetails(id)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    const resBoard = cloneDeep(board)

    resBoard.columns.forEach((column) => {
      // column.cards = resBoard.cards.filter((card) => card.columnId.toString() === column._id.toString())
      column.cards = resBoard.cards.filter((card) => card.columnId.equals(column._id))
    })

    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

const updateColumnOrderIds = async (id, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    }

    const updatedColumnOrderIds = await boardModel.updateColumnOrderIds(id, updateData)

    return updatedColumnOrderIds
  } catch (error) {
    throw error
  }
}

const moveCardToDifferentColunmn = async (data) => {
  try {
    await columnModel.updateCardOrderIds(data.prevColumnId, {
      cardOrderIds: data.prevCardOrderIds,
      updatedAt: Date.now()
    })

    await columnModel.updateCardOrderIds(data.nextColumnId, {
      cardOrderIds: data.nextCardOrderIds,
      updatedAt: Date.now()
    })

    await cardModel.updateCard(data.currentCardId, { columnId: data.nextColumnId })

    return { updateResult: 'Successfully' }
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails,
  updateColumnOrderIds,
  moveCardToDifferentColunmn,
  getAll
}

import { boardModel } from '@/models/boardModel'
import { cardModel } from '@/models/cardModel'
import { columnModel } from '@/models/columnModel'
import ApiError from '@/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (data) => {
  try {
    const newColumn = {
      ...data
    }

    const createdColumn = await columnModel.createNew(newColumn)

    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      getNewColumn.cards = []

      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn
  } catch (error) {
    throw error
  }
}

const updateCardOrderIds = async (id, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    }

    const updatedCardOrderIds = await columnModel.updateCardOrderIds(id, updateData)

    return updatedCardOrderIds
  } catch (error) {
    throw error
  }
}

const deleteColumn = async (id) => {
  try {
    const targetColumn = await columnModel.findOneById(id)

    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')
    }

    await columnModel.deleteOneById(id)

    await cardModel.deleteManyByColumnId(id)

    await boardModel.pullColumnOrderIds(targetColumn)

    return { deleteResult: 'Column and its card deleted successfully! ' }
  } catch (error) {
    throw error
  }
}

export const columnService = {
  createNew,
  updateCardOrderIds,
  deleteColumn
}

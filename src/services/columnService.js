import { boardModel } from '@/models/boardModel'
import { cardModel } from '@/models/cardModel'
import { columnModel } from '@/models/columnModel'
import ApiError from '@/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'

const createNew = async (data) => {
  try {
    const newColumn = {
      ...data
    }

    const createdColumn = await columnModel.createNew(newColumn)

    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      getNewColumn.cards = []

      const itemToPush = {
        columnOrderIds: new ObjectId(getNewColumn._id)
      }

      await boardModel.pushItem(getNewColumn.boardId, itemToPush)
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

    const itemToPull = {
      columnOrderIds: targetColumn._id
    }

    await boardModel.pullItem(targetColumn.boardId, itemToPull)

    return { deleteResult: 'Column and its card deleted successfully! ' }
  } catch (error) {
    throw error
  }
}

const archiveAllCard = async (id) => {
  try {
    const archivedAllCard = await cardModel.archiveAllCard(id)

    return archivedAllCard
  } catch (error) {
    throw error
  }
}

export const columnService = {
  createNew,
  updateCardOrderIds,
  deleteColumn,
  archiveAllCard
}

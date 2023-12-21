import { boardModel } from '@/models/boardModel'
import { columnModel } from '@/models/columnModel'

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

export const columnService = {
  createNew,
  updateCardOrderIds
}

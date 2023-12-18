/* eslint-disable no-useless-catch */

import { cardModel } from '@/models/cardModel'
import { columnModel } from '@/models/columnModel'

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

// const getDetails = async (id) => {
//   try {
//     const board = await boardModel.getDetails(id)
//     if (!board) {
//       throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
//     }

//     const resBoard = cloneDeep(board)

//     resBoard.columns.forEach((column) => {
//       // column.cards = resBoard.cards.filter((card) => card.columnId.toString() === column._id.toString())
//       column.cards = resBoard.cards.filter((card) => card.columnId.equals(column._id))
//     })

//     delete resBoard.cards

//     return resBoard
//   } catch (error) {
//     throw error
//   }
// }

export const cardService = {
  createNew
  // getDetails
}

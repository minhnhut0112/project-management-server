import { cardService } from '@/services/cardService'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  try {
    const createdCard = await cardService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createdCard)
  } catch (error) {
    next(error)
  }
}

// const getDetails = async (req, res, next) => {
//   try {
//     const board = await boardService.getDetails(req.params.id)

//     res.status(StatusCodes.OK).json(board)
//   } catch (error) {
//     next(error)
//   }
// }

const updateCard = async (req, res, next) => {
  try {
    const updatedCard = await cardService.updateCard(req.params.id, req.body)

    res.status(StatusCodes.OK).json(updatedCard)
  } catch (error) {
    next(error)
  }
}

export const cardController = {
  createNew,
  // getDetails
  updateCard
}

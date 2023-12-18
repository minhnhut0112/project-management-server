import { boardService } from '@/services/boardService'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  try {
    const createdBoard = await boardService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) {
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    const board = await boardService.getDetails(req.params.id)

    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createNew,
  getDetails
}

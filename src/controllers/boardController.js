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

const getAll = async (req, res, next) => {
  try {
    const boards = await boardService.getAll()

    res.status(StatusCodes.OK).json(boards)
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

const updateColumnOrderIds = async (req, res, next) => {
  try {
    const updatedColumnOrderIds = await boardService.updateColumnOrderIds(req.params.id, req.body)

    res.status(StatusCodes.OK).json(updatedColumnOrderIds)
  } catch (error) {
    next(error)
  }
}

const moveCardToDifferentColunmn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColunmn(req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const editLabel = async (req, res, next) => {
  try {
    const result = await boardService.editLabel(req.params.id, req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const createNewLabel = async (req, res, next) => {
  try {
    const createdaLabel = await boardService.createNewLabel(req.params.id, req.body)

    res.status(StatusCodes.OK).json(createdaLabel)
  } catch (error) {
    next(error)
  }
}

const deleteLabel = async (req, res, next) => {
  try {
    const result = await boardService.deleteLabel(
      req.params.id,
      req.query.labelId,
      req.query.cardId
    )

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const sendInviteEmail = async (req, res, next) => {
  try {
    const { inviteeEmail, inviterId, boardId } = req.body
    const result = await boardService.sendInviteEmail(inviteeEmail, inviterId, boardId)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const confirmInviteEmail = async (req, res, next) => {
  try {
    const result = await boardService.confirmInviteEmail(req.params.id)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getInvite = async (req, res, next) => {
  try {
    const result = await boardService.getInvite(req.params.id)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createNew,
  getDetails,
  updateColumnOrderIds,
  moveCardToDifferentColunmn,
  getAll,
  editLabel,
  createNewLabel,
  deleteLabel,
  sendInviteEmail,
  confirmInviteEmail,
  getInvite
}

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
    const boards = await boardService.getAll(req.params.id)

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

    global.io.emit('updateColumnOrderIds')

    res.status(StatusCodes.OK).json(updatedColumnOrderIds)
  } catch (error) {
    next(error)
  }
}

const moveCardToDifferentColunmn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColunmn(req.body)

    global.io.emit('moveCardToDifferentColunmn')

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const editLabel = async (req, res, next) => {
  try {
    const result = await boardService.editLabel(req.params.id, req.body)

    global.io.emit('editLabel')

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const createNewLabel = async (req, res, next) => {
  try {
    const createdaLabel = await boardService.createNewLabel(req.params.id, req.body)

    global.io.emit('createNewLabel')

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

    global.io.emit('deleteLabel')

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const changeToAdmin = async (req, res, next) => {
  try {
    const { userId } = req.body

    const result = await boardService.changeToAdmin(req.params.id, userId)

    global.io.emit('changeToAdmin')

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const changeToMember = async (req, res, next) => {
  try {
    const { userId } = req.body
    const result = await boardService.changeToMember(req.params.id, userId)

    global.io.emit('changeToMember')

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const removeFromBoard = async (req, res, next) => {
  try {
    const result = await boardService.removeFromBoard(req.params.id, req.query.userId)

    global.io.emit('removeFromBoard')

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

const uploadCover = async (req, res, next) => {
  try {
    const uploadedCover = await boardService.uploadCover(req.params.id, req.file)

    global.io.emit('uploadedcover')

    res.status(StatusCodes.OK).json(uploadedCover)
  } catch (error) {
    next(error)
  }
}

const deleteBoard = async (req, res, next) => {
  try {
    const result = await boardService.deleteBoard(req.params.id, req.user)

    // global.io.emit('deletedCard')

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const createNewIssue = async (req, res, next) => {
  try {
    const newIssue = await boardService.createNewIssue(req.params.id, req.body)

    global.io.emit('createNewIssue')

    res.status(StatusCodes.OK).json(newIssue)
  } catch (error) {
    next(error)
  }
}

const updateIssue = async (req, res, next) => {
  try {
    const result = await boardService.updateIssue(req.params.id, req.body)

    global.io.emit('updateIssue')

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const editIssue = async (req, res, next) => {
  try {
    const result = await boardService.editIssue(req.params.id, req.body)

    global.io.emit('updateIssue')

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
  getInvite,
  changeToAdmin,
  changeToMember,
  removeFromBoard,
  uploadCover,
  deleteBoard,
  createNewIssue,
  updateIssue,
  editIssue
}

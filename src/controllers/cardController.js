import { cardService } from '@/services/cardService'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  try {
    const createdCard = await cardService.createNew(req.body)

    global.io.emit('createdCard')

    res.status(StatusCodes.CREATED).json(createdCard)
  } catch (error) {
    next(error)
  }
}

const updateCard = async (req, res, next) => {
  try {
    const updatedCard = await cardService.updateCard(req.params.id, req.body)

    global.io.emit('updatedCard')

    res.status(StatusCodes.OK).json(updatedCard)
  } catch (error) {
    next(error)
  }
}

const deleteCard = async (req, res, next) => {
  try {
    const result = await cardService.deleteCard(req.params.id)

    global.io.emit('deletedCard')

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateCover = async (req, res, next) => {
  try {
    const updatedCover = await cardService.updateCover(req.params.id, req.file)

    global.io.emit('updatedCover')

    res.status(StatusCodes.OK).json(updatedCover)
  } catch (error) {
    next(error)
  }
}

const removeCover = async (req, res, next) => {
  try {
    const result = await cardService.unsetCocver(req.params.id)

    global.io.emit('deletedCover')

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateDates = async (req, res, next) => {
  try {
    const updatedDates = await cardService.updateDates(req.params.id, req.body)

    global.io.emit('updateDates')

    res.status(StatusCodes.OK).json(updatedDates)
  } catch (error) {
    next(error)
  }
}

const removeDates = async (req, res, next) => {
  try {
    const result = await cardService.unsetDates(req.params.id)

    global.io.emit('deletedDate')

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const uploadAttachments = async (req, res, next) => {
  try {
    const uploadedAttachments = await cardService.uploadAttachments(req.params.id, req.file)

    global.io.emit('uploadedAttachments')

    res.status(StatusCodes.OK).json(uploadedAttachments)
  } catch (error) {
    next(error)
  }
}

const removeAttachments = async (req, res, next) => {
  try {
    const result = await cardService.removeAttachments(req.params.id, req.body)

    global.io.emit('deletedAttachment')

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const createChecklist = async (req, res, next) => {
  try {
    const checklist = await cardService.createChecklist(req.params.id, req.body)

    global.io.emit('createdChecklist')

    res.status(StatusCodes.OK).json(checklist)
  } catch (error) {
    next(error)
  }
}

const updateCheckList = async (req, res, next) => {
  try {
    const updatedChecklist = await cardService.updateCheckList(req.params.id, req.body)

    global.io.emit('updatedCheckList')

    res.status(StatusCodes.OK).json(updatedChecklist)
  } catch (error) {
    next(error)
  }
}

const createComment = async (req, res, next) => {
  try {
    const commentCreated = await cardService.createComment(req.params.id, req.body)

    global.io.emit('createdComment')

    res.status(StatusCodes.OK).json(commentCreated)
  } catch (error) {
    next(error)
  }
}

export const cardController = {
  createNew,
  updateCard,
  deleteCard,
  updateCover,
  removeAttachments,
  removeCover,
  updateDates,
  removeDates,
  uploadAttachments,
  createChecklist,
  updateCheckList,
  createComment
}

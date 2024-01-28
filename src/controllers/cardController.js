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

const updateCard = async (req, res, next) => {
  try {
    const updatedCard = await cardService.updateCard(req.params.id, req.body)
    res.status(StatusCodes.OK).json(updatedCard)
  } catch (error) {
    next(error)
  }
}

const deleteCard = async (req, res, next) => {
  try {
    const result = await cardService.deleteCard(req.params.id)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateCover = async (req, res, next) => {
  try {
    const updatedCover = await cardService.updateCover(req.params.id, req.file)

    res.status(StatusCodes.OK).json(updatedCover)
  } catch (error) {
    next(error)
  }
}

const removeCover = async (req, res, next) => {
  try {
    const result = await cardService.unsetCocver(req.params.id)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateDates = async (req, res, next) => {
  try {
    const updatedDates = await cardService.updateDates(req.params.id, req.body)

    res.status(StatusCodes.OK).json(updatedDates)
  } catch (error) {
    next(error)
  }
}

const removeDates = async (req, res, next) => {
  try {
    const result = await cardService.unsetDates(req.params.id)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const uploadAttachments = async (req, res, next) => {
  try {
    const uploadedAttachments = await cardService.uploadAttachments(req.params.id, req.file)

    res.status(StatusCodes.OK).json(uploadedAttachments)
  } catch (error) {
    next(error)
  }
}

const removeAttachments = async (req, res, next) => {
  try {
    const result = await cardService.removeAttachments(req.params.id, req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const createChecklist = async (req, res, next) => {
  try {
    const checklist = await cardService.createChecklist(req.params.id, req.body)

    res.status(StatusCodes.OK).json(checklist)
  } catch (error) {
    next(error)
  }
}

const updateCheckList = async (req, res, next) => {
  try {
    const updatedChecklist = await cardService.updateCheckList(req.params.id, req.body)

    res.status(StatusCodes.OK).json(updatedChecklist)
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
  updateCheckList
}

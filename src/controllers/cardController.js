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

const updateCover = async (req, res, next) => {
  try {
    const uploaded = await cardService.updateCover(req.params.id, req.file)

    res.status(StatusCodes.OK).json(uploaded)
  } catch (error) {
    next(error)
  }
}

const unsetField = async (req, res, next) => {
  try {
    const uploaded = await cardService.unsetCocver(req.params.id, req.body)

    res.status(StatusCodes.OK).json(uploaded)
  } catch (error) {
    next(error)
  }
}

const fileUploads = async (req, res, next) => {
  try {
    const uploaded = await cardService.fileUploads(req.params.id, req.file)

    res.status(StatusCodes.OK).json(uploaded)
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

export const cardController = {
  createNew,
  updateCard,
  deleteCard,
  fileUploads,
  updateCover,
  unsetField
}

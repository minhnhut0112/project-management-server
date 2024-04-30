import { columnService } from '@/services/columnService'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  try {
    const createdColumn = await columnService.createNew(req.body)

    global.io.emit('createNewColumn')

    res.status(StatusCodes.CREATED).json(createdColumn)
  } catch (error) {
    next(error)
  }
}

const updateCardOrderIds = async (req, res, next) => {
  try {
    const updatedCardOrderIds = await columnService.updateCardOrderIds(req.params.id, req.body)

    global.io.emit('updateCardOrderIds')

    res.status(StatusCodes.OK).json(updatedCardOrderIds)
  } catch (error) {
    next(error)
  }
}

const deleteColumn = async (req, res, next) => {
  try {
    const result = await columnService.deleteColumn(req.params.id)

    global.io.emit('deleteColumn')

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const archiveAllCard = async (req, res, next) => {
  try {
    const result = await columnService.archiveAllCard(req.params.id)

    global.io.emit('archiveAllCard')

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const columnController = {
  createNew,
  updateCardOrderIds,
  deleteColumn,
  archiveAllCard
}

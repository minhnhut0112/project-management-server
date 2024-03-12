/* eslint-disable no-useless-catch */

import { env } from '@/config/environment'
import { boardModel } from '@/models/boardModel'
import { cardModel } from '@/models/cardModel'
import { columnModel } from '@/models/columnModel'
import { usernModel } from '@/models/userModel'
import ApiError from '@/utils/ApiError'
import { slugify } from '@/utils/formatters'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { ObjectId } from 'mongodb'
import nodemailer from 'nodemailer'

const createNew = async (data) => {
  try {
    const newBoard = {
      ...data,
      slug: slugify(data.title)
    }

    const createdBoard = await boardModel.createNew(newBoard)

    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getAll = async () => {
  try {
    return await boardModel.getAll()
  } catch (error) {
    throw error
  }
}

const getDetails = async (id) => {
  try {
    const board = await boardModel.getDetails(id)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    const memberlist = board.memberIds

    memberlist.push(board.ownerId)

    const members = await usernModel.findMember(memberlist)

    const resBoard = cloneDeep(board)

    resBoard.userInBoard = members

    resBoard.columns.forEach((column) => {
      // column.cards = resBoard.cards.filter((card) => card.columnId.toString() === column._id.toString())
      column.cards = resBoard.cards.filter((card) => card.columnId.equals(column._id))
    })

    resBoard.cards.forEach((card) => {
      if (card.comments && card.comments.length > 0) {
        card.comments.reverse()
      }
    })

    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

const updateColumnOrderIds = async (id, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    }

    const updatedColumnOrderIds = await boardModel.updateBoard(id, updateData)

    return updatedColumnOrderIds
  } catch (error) {
    throw error
  }
}

const moveCardToDifferentColunmn = async (data) => {
  try {
    await columnModel.updateCardOrderIds(data.prevColumnId, {
      cardOrderIds: data.prevCardOrderIds,
      updatedAt: Date.now()
    })

    await columnModel.updateCardOrderIds(data.nextColumnId, {
      cardOrderIds: data.nextCardOrderIds,
      updatedAt: Date.now()
    })

    await cardModel.updateCard(data.currentCardId, { columnId: data.nextColumnId })

    return { updateResult: 'Successfully' }
  } catch (error) {
    throw error
  }
}

const editLabel = async (id, data) => {
  try {
    const board = await boardModel.updateLabel(id, data)

    const cardId = data.cardId

    await cardModel.updateLabel(cardId, data)

    return board
  } catch (error) {
    throw error
  }
}

const createNewLabel = async (id, label) => {
  try {
    const itemToPush = {
      labels: {
        ...label,
        _id: new ObjectId()
      }
    }

    const createdaLabel = await boardModel.pushItem(id, itemToPush)

    return createdaLabel
  } catch (error) {
    throw error
  }
}

const deleteLabel = async (id, labelId, cardId) => {
  try {
    const cardLabelToPull = {
      labels: {
        _id: labelId
      }
    }

    await cardModel.pullItem(cardId, cardLabelToPull)

    const boardLabelToPull = {
      labels: {
        _id: new ObjectId(labelId)
      }
    }

    await boardModel.pullItem(id, boardLabelToPull)

    return { result: 'Remove label is successfully!' }
  } catch (error) {
    throw error
  }
}

const sendInviteEmail = async (email, fullName, boardName) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: env.EMAIL_USERNAME,
        pass: env.EMAIL_PASSWORD
      }
    })

    await transporter.sendMail({
      from: `${fullName} "<nmnhut01122002@gmail.com>`,
      to: email,
      subject: `${fullName} invited you to a Trello board`,
      html: `<div> 
      ${fullName} invited you to their board ${boardName}
      <br/> 
      Join them on Trello to collaborate, manage projects, and reach new productivity peaks. 
      <br/> 
      <button><a href='youtube.com'>Go to board</a></button>
      </div>`
    })

    return 'Send Email Successfully!'
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails,
  updateColumnOrderIds,
  moveCardToDifferentColunmn,
  getAll,
  editLabel,
  createNewLabel,
  deleteLabel,
  sendInviteEmail
}

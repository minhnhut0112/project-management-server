/* eslint-disable no-useless-catch */

import { slugify } from '@/utils/formatters'

const createNew = async (data) => {
  try {
    const newBoard = {
      ...data.boardService,
      slug: slugify(data.title)
    }

    return newBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew
}

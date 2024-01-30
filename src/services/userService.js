/* eslint-disable no-unused-vars */
import { usernModel } from '@/models/userModel'

const authenticateUser = async (email, password) => {
  try {
    const user = usernModel.findOneByEmail(email)

    if (user) {
      return user
    }

    return null
  } catch (error) {
    throw error
  }
}

export const userService = {
  authenticateUser
}

import { env } from '@/config/environment'
import jwt from 'jsonwebtoken'

const generateAccessToken = (userId) => {
  return jwt.sign(
    {
      id: userId
    },
    env.ACCESS_TOKEN,
    { expiresIn: '365d' }
  )
}

const generateRefreshToken = (userId) => {
  return jwt.sign(
    {
      id: userId
    },
    env.ACCESS_TOKEN,
    { expiresIn: '365d' }
  )
}

export const jwtUtils = {
  generateAccessToken,
  generateRefreshToken
}

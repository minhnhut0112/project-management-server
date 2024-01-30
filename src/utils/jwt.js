import { env } from '@/config/environment'
import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
  return jwt.sign(
    {
      userId
    },
    env.ACCESS_TOKEN,
    { expiresIn: '1h' }
  )
}

export const jwtUtils = {
  generateToken
}

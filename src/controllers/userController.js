import { userService } from '@/services/userService'
import { jwtUtils } from '@/utils/jwt'

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await userService.authenticateUser(email, password)

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwtUtils.generateToken(user._id)

    res.cookie('token', token, { httpOnly: true })
    res.json({ message: 'Sign-in successful', token })
  } catch (error) {
    next(error)
  }
}

export const userController = {
  signIn
}

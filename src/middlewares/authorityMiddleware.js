import { env } from '@/config/environment'
import { boardModel } from '@/models/boardModel'
import { cardModel } from '@/models/cardModel'
import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
  const token = req.headers.token
  if (token) {
    const accessToken = token.split(' ')[1]
    jwt.verify(accessToken, env.ACCESS_TOKEN, (err, user) => {
      if (err) {
        return res.status(403).json('Token is not valid!')
      }
      req.user = user
      next()
    })
  } else {
    return res.status(401).json({ message: 'You are not authenticated' })
  }
}

const verifyTokenAndUserAuthorizationToCard = (req, res, next) => {
  verifyToken(req, res, async () => {
    const card = await cardModel.findOneById(req.params.id)
    const board = await boardModel.findOneById(card.boardId)

    const isOwner = board.ownerId?.equals(req.user.id)
    const isBoardAdmin = board.admins?.some((admin) => admin.equals(req.user.id))
    const isBoardMember = board.members?.some((member) => member.equals(req.user.id))

    if (isBoardAdmin || isOwner || isBoardMember) {
      next()
    } else {
      res.status(403).json('You are not allowed to do that!')
    }
  })
}

const verifyTokenAndUAdminAuthorizationToCard = (req, res, next) => {
  verifyToken(req, res, async () => {
    const card = await cardModel.findOneById(req.params.id)
    const board = await boardModel.findOneById(card.boardId)

    const isOwner = board.ownerId?.equals(req.user.id)
    const isBoardAdmin = board.admins?.some((admin) => admin.equals(req.user.id))

    if (isBoardAdmin || isOwner) {
      next()
    } else {
      res.status(403).json('You are not allowed to do that!')
    }
  })
}

const verifyTokenAndAdminAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next()
    } else {
      res.status(403).json('You are not allowed to do that!')
    }
  })
}

module.exports = {
  verifyToken,
  verifyTokenAndUserAuthorizationToCard,
  verifyTokenAndAdminAuthorization,
  verifyTokenAndUAdminAuthorizationToCard
}

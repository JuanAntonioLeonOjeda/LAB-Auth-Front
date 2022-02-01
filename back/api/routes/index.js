const router = require('express').Router()

const userRouter = require('./user.router')
const authRouter = require('./auth.router')
const todoRouter = require('./todo.router')

router.use('/users', userRouter)
router.use('/auth', authRouter)
router.use('/todos', todoRouter)

module.exports = router
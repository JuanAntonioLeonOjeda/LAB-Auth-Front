const router = require('express').Router()

const {
  checkToken,
  checkAdmin
} = require('../utils')

const {
  getAllUsers,
  getProfile,
} = require('../controllers/user.controller')

router.get('/', checkToken, checkAdmin, getAllUsers)
router.get('/:id', checkToken, getProfile)

module.exports = router
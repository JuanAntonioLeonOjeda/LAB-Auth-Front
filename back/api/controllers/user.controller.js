const User = require('../models/user.model')

async function getAllUsers(req, res) {
  try {
    const users = await User.find()
    res.send(users)
  } catch (err) {
    res.json({ getUsersError: err})
  }
}

async function getProfile(req, res) {
  try {
    const user = await User.findById(req.params.id)
    res.json(user)
  } catch (err) {
    res.json({ getProfileError: err})
  }
}

module.exports = {
  getAllUsers,
  getProfile
}
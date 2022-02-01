const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

function checkToken (req, res, next) {
  if(!req.headers.token) {
    res.status(403).send('Error: Token not found')
  } else {
    jwt.verify(req.headers.token, process.env.SECRET, (err, token) => {
      if(err){
        res.send('Error: Token not valid')
      }
      User.findOne({ email: token.email})
      .then(user => {
        res.locals.user = user
        next()
      })
    })
  }
}

function checkAdmin (req, res, next) {
  console.log(res.locals.user.role)
  if (res.locals.user.role !== 'admin') {
    res.send('Error: User not authorized')
  } else {
    next()
  }
}

module.exports = {
  checkToken,
  checkAdmin
}
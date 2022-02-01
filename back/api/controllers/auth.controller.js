const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user.model')

async function signup (req, res) {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10)
    const user = await User.create(req.body)

    const payload = { email: user.email}
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1h'})
    res.status(200).json({ token })
  } catch (err) {
    res.status(500).send(`Error creating user: ${err}`)
  }
}

async function login (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email})

    if (!user) {
      return res.json({ error:'Email or password incorrect'})
    }

    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if(err) {
        return res.send(`Error: ${err}`)
      }
      if(!result){
        return res.json({ error: 'Email or password incorrect'})
      }

      const payload = { email: user.email}
      const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1h'})
      res.status(200).json({ token })
    })
  } catch (err) {
    res.send('Error login user')
  }
}

module.exports = {
  signup,
  login
}
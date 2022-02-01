const mongoose = require('mongoose')
const validate = require('mongoose-validator')

const emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'Invalid email format'
  })
]

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Email already registered!'],
    validate: emailValidator
  },
  password: {
    type: String,
    required: [true, 'Please enter a password of at least 4 characters'],
    minLength: 4
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  todos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'todo'
  }]
})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel
const mongoose= require('mongoose')

const todoSchema = new mongoose.Schema({
  todo: {
    type: String,
    unique: [true, 'Todo already listed!'],
    required: [true, 'Please insert description']
  },
  time: {
    type: Number
  },
  status: {
    type: String,
    enum: ['done', 'undone'],
    default: 'undone'
  }
})

const todoModel = mongoose.model ('todo', todoSchema)

module.exports = todoModel
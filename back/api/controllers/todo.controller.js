const Todo = require('../models/todo.model')
const User = require('../models/user.model')
const mongoose = require('mongoose')

async function getAllTodos(req, res) {
  try {
    await User.findOne( { email: res.locals.user.email})
    .populate('todos')
    .then(user => {
      const list = user.todos.map(item => {
        return item.todo
      })
      res.json(list)
    })
  } catch (err) {
    console.log(err)
    res.json({ getAllTodosError: err })
  }
}

async function getOneTodo(req, res) {
  try {
    const item = await Todo.findById(req.params.id)
    res.json(item.todo)
  } catch (err) {
    res.json({ getOneTodoError: err})
  }
}

async function addTodo(req, res) {
  try {
    const todo = await Todo.create(req.body)
    const user = res.locals.user
    user.todos.push(todo.id)
    user.save()
    res.json(todo)
  } catch (err) {
    res.json({ addTodoError: err})
  }
}

async function updateTodo(req, res) {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body)
    res.json({ message: 'Todo updated!', todo})
  } catch (err) {
    res.json({ updateTodoError: err})
  }
}

async function deleteTodo(req, res) {
  try {
    const user = res.locals.user
    const newList = user.todos.filter(id => {
      const str = id.toString()
      return str !== req.params.id
    })
    user.todos = newList
    user.save()
    const todo = await Todo.findByIdAndDelete(req.params.id)
    res.send('Todo deleted')
  } catch (err) {
    console.log(err)
    res.json({ deteteTodoError: err})
  }
}

module.exports = {
  getAllTodos,
  getOneTodo,
  addTodo,
  updateTodo,
  deleteTodo
}
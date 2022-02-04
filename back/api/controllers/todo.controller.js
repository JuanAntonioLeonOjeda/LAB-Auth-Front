const Todo = require('../models/todo.model')
const User = require('../models/user.model')

async function getAllTodos(req, res) {
  try {
    await User.findOne( { email: res.locals.user.email })
    .populate('todos')
    .then(user => {
      const list = user.todos.map(item => {
        return { todo: item.todo, time: item.time, status: item.status, id: item.id }
      })
      res.status(200).json(list)
    })
  } catch (err) {
    console.log(err)
    res.json({ getAllTodosError: err })
  }
}

async function getOneTodo(req, res) {
  try {
    const item = await Todo.findById(req.params.id)
    res.status(200).json({ todo: item.todo, time: item.time, status: item.status })
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
    res.status(200).json({ message: 'Todo added!', todo })
  } catch (err) {
    res.json({ addTodoError: err})
  }
}

async function updateTodo(req, res) {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).json({ message: 'Todo updated!', todo })
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
    res.status(200).send('Todo deleted')
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
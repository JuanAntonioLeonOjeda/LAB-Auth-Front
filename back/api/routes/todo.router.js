const router = require('express').Router()

const {
  checkToken,
} = require('../utils')

const {
  getAllTodos,
  getOneTodo,
  addTodo,
  updateTodo,
  deleteTodo
} = require('../controllers/todo.controller')

router.get('/', checkToken, getAllTodos)
router.get('/:id', checkToken, getOneTodo)
router.post('/', checkToken, addTodo)
router.patch('/:id', checkToken, updateTodo)
router.delete('/:id', checkToken, deleteTodo)

module.exports = router
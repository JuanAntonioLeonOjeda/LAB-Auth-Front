const signupName = document.getElementById('name-signup')
const signupEmail = document.getElementById('email-signup')
const signupPassword = document.getElementById('password-signup')
const roleSelection = document.getElementById('role-select')

const loginEmail = document.getElementById('email-login')
const loginPassword = document.getElementById('password-login')

const signupButton = document.getElementById('signup-button')
const loginButton = document.getElementById('login-button')
const getUsersButton = document.getElementById('get-users-button')
const logoutButton = document.getElementById('logout-button')

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000
})

signupButton.addEventListener('click', async function() {
  const newUser = {
    name: signupName.value,
    email: signupEmail.value,
    password: signupPassword.value,
    role: roleSelection.value
  }
  try {
    const response = await api.post('/auth/signup', newUser)
    localStorage.setItem('token', response.data.token)
    console.log(response.data)
    if (newUser.role === 'user') {
      userScreen(newUser)
    } else if (newUser.role === 'admin') {
      adminScreen(newUser)
    }
  } catch (err) {
    console.error(err)
  }
})

loginButton.addEventListener('click', async function() {
  const user = {
    email: loginEmail.value,
    password: loginPassword.value
  }
  try {
    const response = await api.post('/auth/login', user)
    localStorage.setItem('token', response.data.token)
    console.log(response.data)
    console.log(response.data.user.role)
    if (response.data.user.role === 'user') {
      userScreen(response.data.user)
    } else if (response.data.user.role === 'admin') {
      adminScreen(response.data.user)
    }
  } catch (err) {
    console.error(err)
  }
})

getUsersButton.addEventListener('click', async function() {
  try {
    const response = await api.get('/users', {
      headers: {
        token: localStorage.getItem('token')
      }
    })
    console.log(response.data)
  } catch (err) {
    console.error(err)
  }
})

logoutButton.addEventListener('click', function(){
  localStorage.removeItem('token')
})

function adminScreen(admin) {
  clearScreen()
  const parent = document.getElementById('main-container')
  const welcome = document.createElement('h1')
  welcome.innerText= `Welcome ${admin.name}!`
  parent.appendChild(welcome)
}

function userScreen(user) {
  clearScreen()
  const parent = document.getElementById('main-container')
  const welcome = document.createElement('h1')
  welcome.innerText= `Welcome ${user.name}!`
  const todoList = document.createElement('div')
  todoList.setAttribute('id', 'todoList-container')
  const todo = document.createElement('div')
  todo.setAttribute('id', 'todo-container')
  todo.innerHTML = `prueba: ${user.todos}`
  parent.appendChild(welcome)
  parent.appendChild(todoList)
  todoList.appendChild(todo)
}


function clearScreen() {
  const board = document.getElementById('main-container')
  const childs = document.querySelectorAll('#main-container > *')
  for (let i = 0; i < childs.length; i++) {
      board.removeChild(childs[i])
  }
}
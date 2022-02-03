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
  const profile = document.createElement('div')
  profile.innerHTML = `<div class = "profile">${user.email}</div><div class = "profile">Role: ${user.role}</div>`
  const getTodosButton = document.createElement('button')
  getTodosButton.setAttribute('id', 'getTodosButton')
  getTodosButton.innerText = 'Your Todos'
  parent.appendChild(welcome)
  parent.appendChild(profile)
  parent.appendChild(todoList)
  parent.appendChild(getTodosButton)

  getTodosButton.addEventListener('click', async function () {
    try {
      const response = await api.get('/todos', {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      response.data.forEach(item => {
        const todo = document.createElement('div')
        todo.innerHTML = `<div class = "todo">Todo: ${item.todo}</div><div class = "todo">Time: ${item.time}</div><div class = "todo">Status: ${item.status}</div>`
        const updateButton = document.createElement('button')
        updateButton.setAttribute('id', 'update-button')
        updateButton.innerText = 'Done'
        const deleteButton = document.createElement('button')
        deleteButton.setAttribute('id', 'delete-button')
        deleteButton.innerText = 'Delete'
        todoList.appendChild(todo)
        todo.appendChild(updateButton)
        todo.appendChild(deleteButton)

        updateButton.addEventListener('click', async function () {
          const response = await api.patch(`/todos/${item.id}`, { status: 'Done' }, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
          console.log(response.data)
        })
      })
    } catch (err) {
      console.error(err)
    }
  })
}


function clearScreen() {
  const board = document.getElementById('main-container')
  const childs = document.querySelectorAll('#main-container > *')
  for (let i = 0; i < childs.length; i++) {
      board.removeChild(childs[i])
  }
}
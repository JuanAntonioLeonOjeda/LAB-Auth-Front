function loadStartScreen() {

  const parent = document.getElementById('main-container')
  parent.innerHTML = `<h1>SIGNUP</h1>
  <label>
    Name
    <input type="text" id="name-signup">
  </label><br>
  <label>
    Email
    <input type="email" id="email-signup">
  </label><br>
  <label>
    Password
    <input type="password" id="password-signup">
  </label><br>
  <label>
    Select role
    <select id="role-select">
      <option value="user" selected>User</option>
      <option value="admin">Admin</option>
    </select>
  </label><br>
  <button id="signup-button">SignUp</button>
  <h2>LOGIN</h2>
  <label>
    Email
    <input type="email" id="email-login">
  </label><br>
  <label>
    Password
    <input type="password" id="password-login">
  </label><br>
  <button id="login-button">Login</button>
  <h3>Get All Users (Admin Only!)</h3>
  <button id="get-users-button">Get Users</button><br>`

  const signupName = document.getElementById('name-signup')
  const signupEmail = document.getElementById('email-signup')
  const signupPassword = document.getElementById('password-signup')
  const roleSelection = document.getElementById('role-select')

  const loginEmail = document.getElementById('email-login')
  const loginPassword = document.getElementById('password-login')

  const signupButton = document.getElementById('signup-button')
  const loginButton = document.getElementById('login-button')
  const getUsersButton = document.getElementById('get-users-button')

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
}

function adminScreen(admin) {
  clearScreen()
  const parent = document.getElementById('main-container')
  const welcome = document.createElement('h1')
  welcome.innerText= `Welcome ${admin.name}!`
  parent.appendChild(welcome)
}

function userScreen(user) {
  clearScreen('main-container', '#main-container > *')
  
  const parent = document.getElementById('main-container')
  const welcome = document.createElement('h1')
  welcome.innerText= `Welcome ${user.name}!`

  const todoList = document.createElement('div')
  todoList.setAttribute('id', 'todoList-container')

  const profile = document.createElement('div')
  profile.innerHTML = `<div class = "profile">${user.email}</div><div class = "profile">Role: ${user.role}</div><button id="logout-button">Logout</button>`

  
  const getTodosButton = document.createElement('button')
  getTodosButton.setAttribute('id', 'getTodosButton')
  getTodosButton.innerText = 'Your Todos'
  
  const newTodo = document.createElement('div')
  newTodo.setAttribute('id', 'new-todo-container')
  newTodo.innerHTML = '<label>New Todo: <input type="text" id="new-todo-input"></label><br><label>Time: <input type="number" id="new-todo-time"></label><br>'
  
  const addTodosButton = document.createElement('button')
  addTodosButton.setAttribute('id', 'add-todo-button')
  addTodosButton.innerText = 'Add Todo'
  
  parent.appendChild(welcome)
  parent.appendChild(profile)
  parent.appendChild(todoList)
  parent.appendChild(getTodosButton)
  parent.appendChild(newTodo)
  parent.appendChild(addTodosButton)
  
  //Mostrar todos los Todos del usuario
  getTodosButton.addEventListener('click', async function () {
    try {
      const response = await api.get('/todos', {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      // Si la lista de Todos ya había sido mostrada, borrarla para volver a mostrarla actualizada
      if (document.getElementById('todo-container')) {
        clearScreen('todoList-container', '#todoList-container > *')
      }
      
      response.data.forEach(item => {
        const todo = document.createElement('div')
        todo.setAttribute('id', 'todo-container')
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
        
        //Actualizar Estado del Todo
        updateButton.addEventListener('click', async function () {
          const response = await api.patch(`/todos/${item.id}`, { status: 'Done' }, {
            headers: {
              token: localStorage.getItem('token')
          }
        })
        console.log(response.data)
      })

      //Eliminar Todo
      deleteButton.addEventListener('click', async function () {
          const response = await api.delete(`/todos/${item.id}`, {
            headers: {
              token: localStorage.getItem('token')
            }
          })
          todoList.removeChild(todo)
          console.log(response.data)
        })
      })
      
      //Logout
      const logoutButton = document.getElementById('logout-button')
      logoutButton.addEventListener('click', function(){
        localStorage.removeItem('token')
        clearScreen('main-container', '#main-container > *')
        loadStartScreen()
      })
    } catch (err) {
      console.error(err)
    }
  })
  
  //Añadir todo
  addTodosButton.addEventListener('click', async function () {
    const todoName = document.getElementById('new-todo-input')
    const todoTime = document.getElementById('new-todo-time')

    try {
      const response = api.post('/todos', {
        todo: todoName.value,
        time: todoTime.value
      }, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      console.log(response.data)
    } catch (err) {
      console.error(err)
    }
  })
}

//Limpiar pantalla
function clearScreen(parent, children) {
  const board = document.getElementById(parent)
  const childs = document.querySelectorAll(children)
  for (let i = 0; i < childs.length; i++) {
      board.removeChild(childs[i])
  }
}



const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000
})

loadStartScreen()

const test = {
  question1: {
    a: 'resp1',
    b: 'resp2',
    c: 'resp3'
  },
  question2: {
    a: 'resp4',
    b: 'resp5',
    c: 'resp6'
  }
}

for (let question in test) {
  console.log(question)
  console.log(test[question])
  for (let option in test[question]) {
    console.log(option)
    console.log(test[question][option])
  }
}

const dni = '12345678D'
console.log((/^\d{8}[a-z]$/i).test(dni))

const phone = '123456789'
console.log((/^\d{9}$/).test(phone))

const email = 'fulano@gmail.com'
console.log((/^(\w+)@(\w+)\.(\w\w+)$/).test(email))

const date = '01/02/1234'
console.log((/\d{2}[/-]?\d{2}[/-]?\d{4}[/-]?/).test(date))

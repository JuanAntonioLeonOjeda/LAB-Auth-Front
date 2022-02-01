const signupName = document.getElementById('name-signup')
const signupEmail = document.getElementById('email-signup')
const signupPassword = document.getElementById('password-signup')

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
    password: signupPassword.value
  }
  try {
    const response = await api.post('/auth/signup', newUser)
    localStorage.setItem('token', response.data.token)
    console.log(response.data)
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


const express = require('express')
const storage = require('../app/storage')
const { reduceTimes, escape: _ } = require('../app/utils')
const { admin } = require('../app/auth')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('pages/home', {
    title: 'Home',
    message: storage.lastMessage ? `<p class="alert">${storage.lastMessage}</p>` : '<p>This is a home page</p>',
    url: req.originalUrl
  })

  storage.lastMessage = ''

  console.log(storage.users)
})

router.route('/register')
  .all(admin)
  .get((req, res) => {
    res.render('pages/register', {
      title: 'Register',
      url: req.originalUrl,
      error: storage.lastError,
      ageOptions: reduceTimes(20, current => `<option value="${current + 10}">${current + 10}</option>`)
    })

    storage.lastError = ''
  })
  .post((req, res) => {
    const {
      username,
      password,
      repeatPassword,
      age,
      student,
      gender
    } = req.body

    const ageInt = parseInt(age)

    let err = ''

    if (!username) {
      err = 'Username is empty'
    } else if (!password) {
      err = 'Password is empty'
    } else if (password !== repeatPassword) {
      err = 'Passwords do not match'
    } else if (!age || ageInt <= 0) {
      err = 'Age is empty'
    } else if (!gender) {
      err = 'Gender is empty'
    } else if (storage.users.findIndex(user => user.username === username) !== -1) {
      err = 'Username already exists'
    }

    storage.lastError = err

    if (err) {
      return res.redirect('/register')
    }

    storage.users.push({
      id: storage.users.length + 1,
      username,
      password,
      age: ageInt,
      student: student ? true : false,
      gender
    })

    storage.lastMessage = `Hi, ${_(username)}. You have been registered! <a href="/login">Log in</a>`
    
    res.redirect('/')
  })

router.route('/login')
  .all(admin)
  .get((req, res) => {
    res.render('pages/login', {
      title: 'Login',
      url: req.originalUrl
    })
  })
  .post((req, res) => {
    const {
      username,
      password
    } = req.body

    let err = ''

    if (!username) {
      err = 'Username is empty'
    } else if (!password) {
      err = 'Password is empty'
    } else {
      const storageUser = storage.users.find(user => (
        user.username === username && user.password === password
      ))

      if (!storageUser) {
        err = 'Invalid username or password'
      } else {
        storage.isLogged = true
        storage.lastMessage = `Hi, ${_(storageUser.username)}. You have been logged in!`
      }
    }

    storage.lastError = err

    if (err) {
      return res.redirect('/register')
    }
    
    res.redirect('/admin')
  })

module.exports = router

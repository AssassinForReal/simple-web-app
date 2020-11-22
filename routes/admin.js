const express = require('express')
const storage = require('../app/storage')
const { auth } = require('../app/auth')
const { userSchema } = require('../app/schema')
const { groupBy, capitalize, escape: _ } = require('../app/utils')
const router = express.Router()

const restrictedPaths = [
  '/admin',
  '/sort',
  '/gender',
  '/show'
]

restrictedPaths.forEach(path => {
  router.use(path, auth)
})

router.get('/admin', (req, res) => {
  res.render('admin/pages/dashboard', {
    title: 'Admin - Dashboard',
    admin: true,
    url: req.originalUrl,
    message: storage.lastMessage && `<p class="alert">${storage.lastMessage}</p>`
  })

  storage.lastMessage = ''
})

router.route('/sort')
  .get((req, res) => {
    const thead = renderTableHeading(Object.values(userSchema))

    const tbody = [...storage.users].sort((a, b) => a.age - b.age)
      .reduce((previous, user) => (
        `
          ${previous}
          ${renderUserRow(user)}
        `
      ), '')

    res.render('admin/pages/sort', {
      title: 'Admin - Sort',
      admin: true,
      url: req.originalUrl,
      ascendingChecked: 'checked',
      descendingChecked: '',
      thead,
      tbody
    })
  })
  .post((req, res) => {
    const { sort } = req.body

    if (sort === 'descending') {
      const thead = renderTableHeading(Object.values(userSchema))

      const tbody = [...storage.users].sort((a, b) => b.age - a.age)
        .reduce((previous, user) => (
          `
          ${previous}
          ${renderUserRow(user)}
        `
        ), '')
      res.render('admin/pages/sort', {
        title: 'Admin - Sort',
        admin: true,
        url: req.originalUrl,
        ascendingChecked: '',
        descendingChecked: 'checked',
        thead,
        tbody
      })
    } else {
      res.redirect('/sort')
    }
  })

router.get('/gender', (req, res) => {
  const users = groupBy(storage.users, 'gender')

  const tables = Object.entries(users)
    .reduce((previous, [property, usersArray]) => (
      `${previous}
      <h2>${_(capitalize(property))}</h2>
      <table class="table">
        <thead>
          <tr>
            ${renderTableHeading(Object.values(userSchema))}
          </tr>
        </thead>
        <tbody>
          ${usersArray.reduce((previous, user) => (
        `
              ${previous}
              ${renderUserRow(user)}
            `
      ), '')}
        </tbody>
      </table>
      `
    ), '')

  res.render('admin/pages/gender', {
    title: 'Admin - Gender',
    admin: true,
    url: req.originalUrl,
    tables
  })
})

router.get('/show', (req, res) => {
  const thead = renderTableHeading(Object.values(userSchema))

  const tbody = storage.users
    .reduce((previous, user) => (
      `
        ${previous}
        ${renderUserRow(user)}
      `
    ), '')

  res.render('admin/pages/show', {
    title: 'Admin - Show',
    admin: true,
    url: req.originalUrl,
    thead,
    tbody
  })
})

router.get('/logout', (req, res) => {
  if (storage.isLogged) {
    storage.isLogged = false
    storage.lastMessage = 'You have been logged out!'
  }
  res.redirect('/')
})

const renderTableHeading = (properties) => (
  properties
    .reduce((previous, current) => (
      `${previous} <th>${current}</th>`
    ), '')
)

const renderUserRow = (user) => (
  `<tr>
    ${Object.entries(user).reduce((previous, [key, value]) => {
    if (key === 'student') {
      value = `<input type="checkbox" disabled ${value ? 'checked' : ''}>`
    } else if (key === 'gender') {
      value = _(capitalize(value))
    } else {
      value = _(value)
    }

    return `${previous} <td>${value}</td>`
  }, '')}
  </tr>`
)

module.exports = router

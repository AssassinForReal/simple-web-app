const storage = require('./storage')

const auth = (req, res, next) => {
  if (!storage.isLogged) {
    return res.render('unauthorized', {
      title: 'Unauthorized',
      url: req.originalUrl
    })
  }
  return next()
}

const admin = (req, res, next) => {
  if (storage.isLogged) {
    storage.lastMessage = 'You are already logged in!'
    return res.redirect('/admin')
  }
  next()
}

module.exports.auth = auth
module.exports.admin = admin

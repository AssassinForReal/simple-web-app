const express = require('express')
const userRouter = require('./user')
const adminRouter = require('./admin')

const router = express.Router()

router.use('/', userRouter)
router.use('/', adminRouter)

router.get('*', (req, res) => {
  res.render('not-found', { title: '404 Not Found' })
})

module.exports = router

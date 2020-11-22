const express = require('express')
const bodyParser = require('body-parser')
const router = require('./routes')
const viewEngine = require('./app/view-engine')

const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'html')
app.engine('html', viewEngine)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))
app.use('/', router)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

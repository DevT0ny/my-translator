// imports
require('dotenv').config()
const express = require('express')

// utils
const { isDev } = require('./util/constants')

// routes
const translateRoute = require('./routes/translate')
const devRoute = require('./routes/dev')

// models
const models = [require('./models/Translation')]
Promise.all(models.map((model) => model.sync())).then(() => console.log('Tables synced'))

const app = express()
const { NODE_ENV, PORT } = process.env

app.use(express.json())
app.disable('x-powered-by')

if (isDev) {
  const morgan = require('morgan')
  const chalk = require('chalk')
  morgan.token('timestamp', () => chalk.magentaBright(`[${new Date().toLocaleTimeString()}]`))
  app.use(morgan(':timestamp :method :url :status :response-time ms'))
}

/*  routes  */
app.use('/translate', translateRoute)
if (isDev) app.use('/dev', devRoute)

app.listen(PORT, () => console.log(`Server started on [${PORT}] in [${NODE_ENV}] mode`))

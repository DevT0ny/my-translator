require('dotenv').config()
const express = require('express')
const translator = require('./util/translator')
const app = express()
const { NODE_ENV, PORT } = process.env

app.use(express.json())
app.disable('x-powered-by')

if (NODE_ENV != 'production') {
  const morgan = require('morgan')
  const chalk = require('chalk')
  morgan.token('timestamp', () => chalk.magentaBright(`[${new Date().toLocaleTimeString()}]`))
  app.use(morgan(':timestamp :method :url :status :response-time ms'))
}

/* --- routes --- */

app.get('/', (_, res) => {
  res.json(['hello', 'world'])
})

app.post('/', async (req, res) => {
  try {
    const { body, source, target } = req.body
    const translations = await translator.translate(body, source, target)
    res.json({ translations })
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: error })
  }
})

app.listen(PORT, () => console.log(`Server started on [${PORT}] in [${NODE_ENV}] mode`))

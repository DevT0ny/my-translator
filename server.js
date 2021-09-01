require('dotenv').config()
const express = require('express')

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

app.post('/', (req, res) => {
  try {
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: error })
  }
})

app.listen(PORT, () => console.log(`Server started on [${PORT}] in [${NODE_ENV}] mode`))

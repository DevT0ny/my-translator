require('dotenv').config()
const express = require('express')
const { Op } = require('sequelize')

const translator = require('./util/translator')
const Translation = require('./models/Translation')

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

app.get('/', async (_, res) => {
  try {
    const cache = await Translation.findAll()
    res.json({ cache })
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: error })
  }
})

app.post('/', async (req, res) => {
  try {
    const { text: text_, from, to } = req.body
    // TODO: validate source and targets with lang support list

    if (!text_ || !from || !to) throw new Error('Invalid data')

    const text = text_.toLowerCase().trim()
    if (from === to) return res.json({ result: { [to]: text } })

    //const translations = await translator.translate(text, from, to)
    //res.json({ translations })

    const cache = await Translation.findOne({
      attributes: [to],
      where: { [from]: text, [to]: { [Op.ne]: null } },
    })
    if (cache) return res.json({ result: cache })

    const translatedText = req.body[to] || 'missing'

    await Translation.create({ [from]: text, [to]: translatedText })

    res.json({ [to]: translatedText })
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: error })
  }
})

app.listen(PORT, () => console.log(`Server started on [${PORT}] in [${NODE_ENV}] mode`))

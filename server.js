require('dotenv').config()
const express = require('express')

const { isDev } = require('./util/constants')
const translator = require('./util/translator')
const cache = require('./util/cache')
const validator = require('./util/validator')

const devRoute = require('./routes/dev')

const app = express()
const { NODE_ENV, PORT } = process.env

app.use(express.json())
app.disable('x-powered-by')

if (isDev) {
  const morgan = require('morgan')
  var chalk = require('chalk')
  morgan.token('timestamp', () => chalk.magentaBright(`[${new Date().toLocaleTimeString()}]`))
  app.use(morgan(':timestamp :method :url :status :response-time ms'))
}

/*  routes  */

/* POST /
 * request should contain `text`, `from` lang and `to` lang
 * responds with translated text
 */

app.post('/', async (req, res) => {
  try {
    let { text, from, to } = req.body
    if (!text || !validator.isString(text)) throw new Error('Invalid text value')
    if (!to || !validator.isString(to)) throw new Error('Invalid to value')
    if (from && !validator.isString(from)) throw new Error('Invalid from value')

    text = text.trim()

    const langs = translator.listLanguagesOffline().map(({ code }) => code)
    if (from && !langs.includes(from)) throw new Error('from language is not supported')
    if (!langs.includes(to)) throw new Error('to language is not supported')
    if (!from) {
      const [detection] = await translator.detectLanguage(text)
      if (detection.confidence < 0.5) throw new Error('Cant be translated')
      from = detection.language
    }

    const cacheResult = await cache.get(from, to, text)
    if (cacheResult) return res.json({ translatedText: cacheResult[to] })

    cache
      .preSet(from, text, langs, translator.translate)
      .then(() => isDev && console.log(chalk.greenBright('--- successfully saved ---')))
      .catch((error) => {
        console.log('--- failed to save ---')
        console.error(error)
      })

    const { text: translatedText } = await translator.translate(from, text, to)
    res.json({ translatedText: translatedText[0] })
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: error.message || error })
  }
})

if (isDev) app.use('/dev', devRoute)

app.listen(PORT, () => console.log(`Server started on [${PORT}] in [${NODE_ENV}] mode`))

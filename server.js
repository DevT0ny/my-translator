// imports
require('dotenv').config()
const express = require('express')

// utils
const { isDev } = require('./util/constants')
const translator = require('./util/translator')
const cache = require('./util/cache')
const validator = require('./util/validator')

// routes
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
    // validation
    let { text, from, to } = req.body
    if (!text || !validator.isString(text)) throw new Error('Invalid text value')
    if (!to || !validator.isString(to)) throw new Error('Invalid to value')
    if (from && !validator.isString(from)) throw new Error('Invalid from value')

    text = text.trim()

    // get supported languages and validate input
    const langs = translator.listLanguagesOffline().map(({ code }) => code)
    if (from && !langs.includes(from)) throw new Error('from language is not supported')
    if (!langs.includes(to)) throw new Error('to language is not supported')
    if (!from) {
      const [detection] = await translator.detectLanguage(text)
      if (detection.confidence < 0.5) throw new Error('Cant be translated')
      from = detection.language
    }

    // check already exists in cache database
    const cacheResult = await cache.get(from, to, text)
    if (cacheResult) return res.json({ translatedText: cacheResult[to] })

    // pre cache: performs translation for all supported languages and stores in database asynchronously
    cache
      .preSet(from, text, langs, translator.translate)
      .then(() => isDev && console.log(chalk.greenBright('--- successfully saved ---')))
      .catch((error) => {
        console.log('--- failed to save ---')
        console.error(error)
      })

    // get translation using google cloud translation api
    //isDev && console.time('translate req')
    const { text: translatedText } = await translator.translate(from, text, to)
    //isDev && console.timeEnd('translate req')
    res.json({ translatedText: translatedText[0] })
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: error.message || error })
  }
})

if (isDev) app.use('/dev', devRoute)

app.listen(PORT, () => console.log(`Server started on [${PORT}] in [${NODE_ENV}] mode`))

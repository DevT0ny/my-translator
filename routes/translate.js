//imports
const express = require('express')
const chalk = require('chalk')

// utils
const { isDev, isTest } = require('../util/constants')
const translator = require('../util/translator')
const cache = require('../util/cache')
const validator = require('../util/validator')

const router = express.Router()

/* POST /translate
 * request should contain `text`, `from` lang and `to` lang
 * responds with translated text
 */

router.post('/', async (req, res) => {
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

    // if from is missing detect using Google's language detection api
    if (!from) {
      const [detection] = await translator.detectLanguage(text)
      if (detection.confidence < 0.5) throw new Error('Cant be translated')
      from = detection.language
    }

    if (from === to) return res.json({ translatedText: text, lang: to })

    // check already exists in cache database
    const cacheResult = await cache.get(from, to, text)
    if (cacheResult) return res.json({ translatedText: cacheResult[to], lang: to })

    // get translation using google cloud translation api
    const {
      text: [translatedText],
    } = await translator.translate(from, text, to)

    // pre cache: performs translation for all supported languages and stores in database asynchronously
    try {
      await cache.preSet(from, text, langs, translator.translate)
      isDev && console.log(chalk.greenBright('--- successfully saved translation of [%s]---'), text)
    } catch (error) {
      console.log('--- failed to save translation of [%s] ---', text)
      console.error(error)
    }

    res.json({ translatedText, lang: to })
  } catch (error) {
    !isTest && console.error(error)
    res.status(400).json({ message: error.message || error })
  }
})

/* POST /translate/type2
 * request should contain `text`, `from` lang and `to` lang
 * responds with translated text
 * note : this request does not wait for cache to complete,
 * because of asynchronous task it is also difficult to test.
 */

router.post('/type2', async (req, res) => {
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

    // if from is missing detect using Google's language detection api
    if (!from) {
      const [detection] = await translator.detectLanguage(text)
      if (detection.confidence < 0.5) throw new Error('Cant be translated')
      from = detection.language
    }

    if (from === to) return res.json({ translatedText: text, lang: to })

    // check already exists in cache database
    const cacheResult = await cache.get(from, to, text)
    if (cacheResult) return res.json({ translatedText: cacheResult[to], lang: to })

    // pre cache: performs translation for all supported languages and stores in database asynchronously
    const {
      text: [translatedText],
    } = await translator.translate(from, text, to)
    res.json({ translatedText, lang: to })

    cache
      .preSet(from, text, langs, translator.translate)
      .then(
        () =>
          isDev &&
          console.log(chalk.greenBright('--- successfully saved translation of [%s]---'), text)
      )
      .catch((error) => {
        console.log('--- failed to save translation of [%s] ---', text)
        console.error(error)
      })

    // get translation using google cloud translation api
  } catch (error) {
    !isTest && console.error(error)
    res.status(400).json({ message: error.message || error })
  }
})

module.exports = router

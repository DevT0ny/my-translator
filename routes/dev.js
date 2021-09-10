const express = require('express')
const Translation = require('../models/Translation')
const translator = require('../util/translator')
//const cache = require('../util/cache')

const router = express.Router()

router.get('/', async (_, res) => {
  try {
    const cache = await Translation.findAll()
    res.json(cache)
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: error })
  }
})

router.post('/', async (req, res) => {
  try {
    const { text, from, to } = req.body
    const translation = await translator.translate(text, from, to)
    res.json(translation)
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: error.message })
  }
})

router.post('/detect', async (req, res) => {
  try {
    const { text } = req.body
    res.json(await translator.detectLanguage(text))
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: error.message })
  }
})

router.get('/lang', async (req, res) => {
  try {
    const { force } = req.params
    const langs = !!force ? await translator.listLanguages() : translator.listLanguagesOffline()
    res.json(langs)
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: error.message })
  }
})

module.exports = router

require('dotenv').config()
const express = require('express')
const request = require('supertest')
const translateRoutes = require('../../routes/translate')
const db = require('../../config/db')
const models = [require('../../models/Translation')]
const langs = require('../../config/langs.json')
const sampleTranslations = require('../test-translation.json')

const app = express()
app.use(express.json())

beforeAll(async () => {
  app.use('/translate', translateRoutes)
  await Promise.all(models.map((model) => model.sync({ force: true })))
  await db.authenticate()
  console.log('ready to test')
})

//afterAll(async () => {})

describe('input validation tests', () => {
  it('no-body', async () => {
    const res = await request(app).post('/translate').send({})
    expect(res.statusCode).toBe(400)
    expect(res.body.message).toBe('Invalid text value')
  })

  it('empty `text` field', async () => {
    const res = await request(app).post('/translate').send({
      text: '',
    })
    expect(res.statusCode).toBe(400)
    expect(res.body.message).toBe('Invalid text value')
  })

  it('empty `to` field', async () => {
    const res = await request(app).post('/translate').send({
      text: 'Hello',
      from: 'en',
    })
    expect(res.statusCode).toBe(400)
    expect(res.body.message).toBe('Invalid to value')
  })

  it('unknown lanaguage in `to` field', async () => {
    const res = await request(app).post('/translate').send({
      text: 'Hello',
      from: 'en',
      to: 'uknown',
    })
    expect(res.statusCode).toBe(400)
    expect(res.body.message).toBe('to language is not supported')
  })

  it('unknown lanaguage in `from` field', async () => {
    const res = await request(app).post('/translate').send({
      text: 'Hello',
      to: 'en',
      from: 'uknown',
    })
    expect(res.statusCode).toBe(400)
    expect(res.body.message).toBe('from language is not supported')
  })
})

describe('translatiion tests', () => {
  jest.setTimeout(30 * 1000)

  it('translate "Hello world" to hindi', async () => {
    const text = 'Hello world'
    const to = 'hi'
    const res = await request(app).post('/translate').send({
      from: 'en',
      text,
      to,
    })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      translatedText: 'नमस्ते दुनिया',
      lang: to,
    })
  })

  it('translate "Javascript is a programming lanaguage" to kannada', async () => {
    const text = 'Javascript is a programming lanaguage'
    const to = 'kn'
    const res = await request(app).post('/translate').send({
      from: 'en',
      text,
      to,
    })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      translatedText: 'ಜಾವಾಸ್ಕ್ರಿಪ್ಟ್ ಒಂದು ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆಯಾಗಿದೆ',
      lang: to,
    })
  })

  it('translate "The quick brown fox jumpes over the lazy dog" without `from` field', async () => {
    const text = 'The quick brown fox jumpes over the lazy dog'
    const to = 'hi'
    const res = await request(app).post('/translate').send({
      text,
      to,
    })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      translatedText: 'तेज़ भूरी लोमड़ी आलसी कुत्ते के ऊपर से कूद जाती है',
      lang: to,
    })
  })

  it('translate "hello world" to all lanaguages', async () => {
    const text = 'Hello world'
    const reqs = langs.map(async ({ code: to }) =>
      request(app).post('/translate').send({
        from: 'en',
        text,
        to,
      })
    )
    const ress = await Promise.all(reqs)
    const formattedRes = Object.fromEntries(
      ress.map(({ body: { translatedText, lang } }) => [lang, translatedText])
    )
    expect(formattedRes).toEqual(sampleTranslations[text])
  })

  it('translate "Javascript is a programming lanaguage" to all lanaguages', async () => {
    const text = 'Javascript is a programming lanaguage'
    const reqs = langs.map(async ({ code: to }) =>
      request(app).post('/translate').send({
        from: 'en',
        text,
        to,
      })
    )
    const ress = await Promise.all(reqs)
    const formattedRes = Object.fromEntries(
      ress.map(({ body: { translatedText, lang } }) => [lang, translatedText])
    )
    expect(formattedRes).toEqual(sampleTranslations[text])
  })
})

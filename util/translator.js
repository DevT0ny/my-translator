const { Translate } = require('@google-cloud/translate').v2
const gTranslate = new Translate()
const languages = require('../config/langs.json')

/**
 * Translation result
 * @typedef {Object} translated
 * @property {string} lang translated text language
 * @property {string[]} text translated text
 */

/**
 * Translates text to target language
 * @param {(string|string[])} text text to be translated
 * @param {string} from source language
 * @param {string} to target language
 * @returns Promise<translated> returns translation(s)
 */

async function translate(from, text, to) {
  const [translations] = from !== to ? await gTranslate.translate(text, { from, to }) : [text]
  return {
    lang: to,
    text: Array.isArray(translations) ? translations : [translations],
  }
}

/**
 * Lists available translation language with their names in English (the default).
 * @returns Promise<string[]> returns supported languages
 */

async function listLanguages() {
  const [languages] = await gTranslate.getLanguages()
  console.log('ya')
  return languages
}

/**
 * Detects language of given text input
 */

async function detectLanguage(text) {
  const [detections] = await gTranslate.detect(text)
  return Array.isArray(detections) ? detections : [detections]
}

module.exports = {
  translate,
  listLanguages,
  listLanguagesOffline: () => languages,
  detectLanguage,
}

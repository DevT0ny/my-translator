const { Translate } = require('@google-cloud/translate').v2
const gTranslate = new Translate()

/**
 * Translates text to target language
 * @param {(string|string[])} text text to be translated
 * @param {string} from source language
 * @param {string} to target language
 */

async function translate(text, from, to) {
  const [translations] = await gTranslate.translate(text, { from, to })
  return Array.isArray(translations) ? translations : [translations]
}

/**
 * Lists available translation language with their names in English (the default).
 */

async function listLanguages() {
  const [languages] = await gTranslate.getLanguages()
  return languages
}

module.exports = {
  translate,
  listLanguages,
}

const { Translate } = require('@google-cloud/translate').v2
const gTranslate = new Translate()

/**
 * Translates text to target language
 * @param {(string|string[])} text text to be translated
 * @param {string} source source language
 * @param {string} target target language
 */

async function translate(text, source, target) {
  let [translations] = await gTranslate.translate(text, { from: source, to: target })
  translations = Array.isArray(translations) ? translations : [translations]
  return translations
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

const { Op } = require('sequelize')
const Translation = require('../models/Translation')

const get = (from, to, text) =>
  Translation.findOne({
    attributes: [to],
    where: { [from]: text, [to]: { [Op.ne]: null } },
  })

const preSet = async (from, text, langs, translate) => {
  const translationsReq = langs.map((to) => translate(from, text, to))
  const translationsRes = await Promise.all(translationsReq)
  const translations = Object.fromEntries(translationsRes.map(({ lang, text }) => [lang, text[0]]))
  return await Translation.create(translations)
}

module.exports = {
  get,
  preSet,
}

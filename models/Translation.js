const { DataTypes } = require('sequelize')
const db = require('../config/db')

const Translation = db.define('translation', {
  en: {
    type: DataTypes.STRING,
  },
  kn: {
    type: DataTypes.STRING,
  },
  hi: {
    type: DataTypes.STRING,
  },
})

Translation.sync()
  .then(() => console.log('Table synced'))
  .catch((err) => {
    console.error('Table syncing failed...')
    throw err
  })

module.exports = Translation

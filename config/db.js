const { Sequelize } = require('sequelize')

const { NODE_ENV, DB_NAME, DB_USER, DB_PASS, DB_PORT, DB_HOST } = process.env

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST || 'localhost',
  port: DB_PORT || 3306,
  dialect: 'mysql',
  logging: NODE_ENV === 'development' ? console.log : false,
})

module.exports = db

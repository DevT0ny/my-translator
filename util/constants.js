const { NODE_ENV } = process.env

module.exports = {
  isDev: NODE_ENV === 'development',
  isProd: NODE_ENV === 'production',
  isTest: NODE_ENV === 'node',
}

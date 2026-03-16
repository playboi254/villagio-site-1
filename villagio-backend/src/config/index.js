const path = require('path')

// Load .env relative to the project root (villagio-backend folder)
require('dotenv').config({ path: path.join(__dirname, '../../.env') })

const serverConfig = require('./server')
const databaseConfig = require('./database')
const securityConfig = require('./security')

module.exports = {
  server: serverConfig,
  database: databaseConfig,
  security: securityConfig
}

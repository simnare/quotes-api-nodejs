import http from 'http'

import app from '../app'
import logger from '../logger'

const logger = logger('quotes-api', process.env.APP_LOG_LEVEL || 'info')
const port = process.env.APP_PORT || '3000'
app.set('port', port)

const server = http.createServer(app)
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Callback for "error" event on HTTP server
 *
 * @param {*} error
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  let bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Callback for "listening" event of HTTP server
 */
function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
  logger.debug('started listening for http requests', {bind})
}

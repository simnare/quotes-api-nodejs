'use strict'

import { createLogger, format, transports } from 'winston'

let logger

/**
 * @returns {winston.logger}
 */
export function get () {
  return logger
}

export function create (service, level) {
  logger = createLogger({
    level,
    format: format.combine(
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    defaultMeta: { service },
    transports: [
      new transports.Console()
    ]
  })
}

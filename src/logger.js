import { createLogger, format, transports } from 'winston'

export default (service, level) => createLogger({
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

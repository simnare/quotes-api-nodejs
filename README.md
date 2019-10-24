# Quotes API

## Running
### In development
    npm run watch

### In production
    npm start


## Available environment variables
 - `APP_PORT` - defines port to listen for http connections, defaults to `3000`
 - `APP_LOG_LEVEL` - defines log level for logging framework, defaults to `info`
 - `APP_RATES_API_KEY` - defines rates api access key

## Notes
 - Supported currencies are defined in `src/config.js`.
 - `npm test` executes test suites.
 - Ensure that `APP_RATES_API_KEY` environment variable is available and set to a valid api key for _fixer.io_ service.
 - Set `APP_LOG_LEVEL` to _debug_ to see debug messages.

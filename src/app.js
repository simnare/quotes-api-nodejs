'use strict'

import express from 'express'
import CacheStorage from 'ttl-mem-cache'
import exchangeRouter from './exchange/routes'
import RatesCache from './exchange/infrastructure/cache'
import Client from './exchange/infrastructure/client'
import config from './config'

const app = express()
const ratesClient = new Client(config.rates_api.url, config.rates_api.accessKey)
const ratesCache = new RatesCache(new CacheStorage({ ttl: 15 * 1000 }))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api', exchangeRouter(ratesCache))

app.use((err, req, res, next) => {
  res.status(500).send('Something broke!')
})

async function ratesSync () {
  try {
    const rates = await ratesClient.getRates(config.currencies[0])
    ratesCache.set(rates)
  } catch (err) { }
}

setImmediate(ratesSync)
setInterval(ratesSync, 10 * 1000)

export default app

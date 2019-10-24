'use strict'

import express from 'express'
import CacheStorage from 'ttl-mem-cache'
import { RatesService, ERROR_UNKNOWN_CURRENCY } from './services'
import Client from './infrastructure/client'
import RatesCache from './infrastructure/cache'
import config from '../config'

const router = express.Router()
const ratesCache = new RatesCache(new CacheStorage({ ttl: 10 * 1000 }))

/**
 * If number of routes would increase i'd move handling to separate function
 */
router.get('/quote', async function (req, res) {
  const srcCurrency = req.query.required_currency_code
  const dstCurrency = req.query.paying_currency_code
  const amount = parseInt(req.query.amount, 10)

  if (amount < 0) {
    res.status(400).json({ error_message: 'Provide positive integer as an amount' })
    return
  }

  if (!isKnownCurrency(srcCurrency)) {
    res.status(400).json({ error_message: 'Unknown required currency provided' })
    return
  }

  if (!isKnownCurrency(dstCurrency)) {
    res.status(400).json({ error_message: 'Unknown paying currency provided' })
    return
  }

  const ratesService = new RatesService(
    new Client(config.rates_api.url, config.rates_api.accessKey),
    ratesCache
  )

  try {
    const maybeRate = await ratesService.getRate(srcCurrency, dstCurrency)

    res.json({
      paying_currency_code: dstCurrency.toUpperCase(),
      amount: amount * maybeRate
    })
  } catch (err) {
    if (err.message === ERROR_UNKNOWN_CURRENCY) {
      res.status(400).json({ error_message: 'Unknown paying_currency_code value' })
    }

    res.status(500).json({ error_message: 'Unknown error occured' })
  }
})

/**
 * @param {String} currency
 * @returns {Boolean}
 */
function isKnownCurrency (currency) {
  currency = currency.toUpperCase()

  return config.currencies.indexOf(currency) !== -1
}

export default router

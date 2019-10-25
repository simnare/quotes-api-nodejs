'use strict'

import express from 'express'
import { RatesService } from './services'
import config from '../config'

/**
 * @param {String} currency
 * @returns {Boolean}
 */
function isKnownCurrency (currency) {
  currency = currency.toUpperCase()

  return config.currencies.indexOf(currency) !== -1
}

export default ratesCache => {
  const router = express.Router()

  /**
   * If number of routes would increase i'd move handling to separate function
   */
  router.get('/quote', function (req, res) {
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

    const ratesService = new RatesService(ratesCache)
    const rate = ratesService.getRate(srcCurrency, dstCurrency)

    if (rate) {
      res.json({
        paying_currency_code: dstCurrency.toUpperCase(),
        amount: amount * rate
      })
      return
    }

    res.status(502).json({ error_message: 'Service temporary not available' })
  })

  return router
}

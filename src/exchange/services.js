'use strict'

import { get as getLogger } from '../logger'

export const ERROR_UNKNOWN_CURRENCY = 100
export const ERROR_OTHER = 101

export class RatesService {
  /**
  * @param {Client} client
  * @param {Cache} cache
  */
  constructor (client, cache, logger) {
    this.client = client
    this.cache = cache
    this.logger = logger || getLogger()
  }

  /**
   * Retrieves rate for dstCurrency based on srcCurrency.
   * Checks cache before making http request.
   *
   * @param {String} srcCurrency
   * @param {String} dstCurrency
   * @returns {Number|false}
   */
  async getRate (srcCurrency, dstCurrency) {
    let rates = {}

    const cachedRate = this.cache.get(srcCurrency, dstCurrency)
    if (cachedRate) {
      return cachedRate
    }

    const reversedCachedRate = this.cache.get(dstCurrency, srcCurrency)
    if (reversedCachedRate) {
      return calculateReversedRate(reversedCachedRate)
    }

    try {
      rates = await this.client.getRates(srcCurrency)
      this.cache.set(srcCurrency, rates)
    } catch (err) {
      this.logger.error('error while retrieving exchange rate', { err, dstCurrency, srcCurrency })
      throw new Error(ERROR_OTHER)
    }

    const fixedCurrency = dstCurrency.toUpperCase()

    if (rates[fixedCurrency]) {
      return rates[fixedCurrency]
    } else {
      this.logger.warn('destination currency not found in response', { dstCurrency, srcCurrency })
      throw new Error(ERROR_UNKNOWN_CURRENCY)
    }
  }
}

/**
 * Calculates inversed exchange rate.
 *
 * @param {Number} rate
 */
function calculateReversedRate (rate) {
  return 1 / rate
}

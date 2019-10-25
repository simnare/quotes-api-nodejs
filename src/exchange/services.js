'use strict'

import { get as getLogger } from '../logger'

export class RatesService {
  /**
  * @param {Cache} cache
  */
  constructor (cache, logger) {
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
  getRate (srcCurrency, dstCurrency) {
    const cachedRate = this.cache.get(srcCurrency, dstCurrency)
    if (cachedRate) {
      return cachedRate
    }

    return false
  }
}

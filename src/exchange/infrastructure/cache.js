export default class RatesCache {
  constructor (storage) {
    this.storage = storage
  }

  /**
   * Returns exchange rate from cache.
   *
   * @param {String} baseCurrency
   * @param {String} targetCurrency
   */
  get (baseCurrency, targetCurrency) {
    baseCurrency = baseCurrency.toUpperCase()
    targetCurrency = targetCurrency.toUpperCase()

    const rates = this.storage.get(baseCurrency)
    if (rates && rates[targetCurrency]) {
      return rates[targetCurrency]
    }

    return undefined
  }

  /**
   * @param {String} baseCurrency
   * @param {Object} rates
   */
  set (baseCurrency, rates) {
    this.storage.set(baseCurrency.toUpperCase(), rates)
  }
}

export default class RatesCache {
  constructor (storage) {
    this.storage = storage
    this.key = 'exchange_rates'
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

    const rates = this.storage.get(this.key)
    if (rates && rates[targetCurrency] && rates[baseCurrency]) {
      return rates[targetCurrency] / rates[baseCurrency]
    }

    return undefined
  }

  /**
   * @param {Object} rates
   */
  set (rates) {
    this.storage.set(this.key, rates)
  }
}

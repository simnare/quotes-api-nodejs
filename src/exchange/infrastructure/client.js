import { get as httpGet } from 'axios'
import { get as getLogger } from '../../logger'

export default class Client {
  /**
   * @param {string} url
   * @param {string} accessKey
   */
  constructor (url, accessKey, logger) {
    this.url = url
    this.accessKey = accessKey
    this.logger = logger || getLogger()
    this.requestsMap = {}
  }

  async getRates (baseCurrency) {
    const response = await httpGet(
      this.url,
      { params: { base: baseCurrency, access_key: this.accessKey } }
    )

    if (response.status === 200 && response.data && response.data.success) {
      return response.data.rates
    } else {
      this.logger.warn('received malformed response from rates api', { response })
      throw new Error('Received malformed response from rates api')
    }
  }
}

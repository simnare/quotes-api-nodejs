export default {
  currencies: ['EUR', 'ILS', 'USD'],
  rates_api: {
    url: 'http://data.fixer.io/api/latest',
    accessKey: process.env.APP_RATES_API_KEY || ''
  }
}

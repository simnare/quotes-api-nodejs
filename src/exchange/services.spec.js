import { RatesService } from './services'
import RatesCache from './infrastructure/cache'

jest.mock('./infrastructure/cache')

describe('Rates service', () => {
  test('checkes cache first', () => {
    const cache = new RatesCache()

    const getCacheFnMock = RatesCache.mock.instances[0].get
    getCacheFnMock.mockReturnValue(42)

    const service = new RatesService(cache)

    const result = service.getRate('foo', 'bar')
    expect(result).toBe(42)
  })
})

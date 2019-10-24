import { RatesService, ERROR_UNKNOWN_CURRENCY } from './services'
import RatesClient from './infrastructure/client'
import RatesCache from './infrastructure/cache'

jest.mock('./infrastructure/client')
jest.mock('./infrastructure/cache')

describe('Rates service', () => {
  test('checkes cache first', async () => {
    const client = new RatesClient('example.com', 'lorem', {})
    const cache = new RatesCache()

    const getCacheFnMock = RatesCache.mock.instances[0].get
    getCacheFnMock.mockReturnValue(42)
    const getRatesClientFnMock = RatesClient.mock.instances[0].getRates
    getRatesClientFnMock.mockReturnValue(1)

    const service = new RatesService(client, cache)

    const result = await service.getRate('foo', 'bar')
    expect(result).toBe(42)
    expect(getRatesClientFnMock).not.toBeCalled()
  })

  test('retrieves rate from rates api if no cache found', async () => {
    const client = new RatesClient('example.com', 'lorem', {})
    const cache = new RatesCache()

    const getCacheFnMock = RatesCache.mock.instances[0].get
    getCacheFnMock.mockReturnValue(undefined)
    const getRatesClientFnMock = RatesClient.mock.instances[0].getRates
    getRatesClientFnMock.mockReturnValue({ BAR: 24 })

    const service = new RatesService(client, cache)

    const result = await service.getRate('foo', 'bar')
    expect(result).toBe(24)
    expect(getRatesClientFnMock).toHaveBeenCalledTimes(1)
    expect(getRatesClientFnMock.mock.calls[0][0]).toBe('foo')
  })

  test('returns custom error in case when currency is not known', async () => {
    const client = new RatesClient('example.com', 'lorem', { warn: jest.fn() })
    const cache = new RatesCache()

    const getCacheFnMock = RatesCache.mock.instances[0].get
    getCacheFnMock.mockReturnValue(undefined)
    const getRatesClientFnMock = RatesClient.mock.instances[0].getRates
    getRatesClientFnMock.mockReturnValue({ BAZ: 123 })

    const service = new RatesService(client, cache, { warn: jest.fn() })

    try {
      await service.getRate('foo', 'bar')
    } catch (err) {
      expect(err.message).toEqual(ERROR_UNKNOWN_CURRENCY + '')
    }

    expect(getRatesClientFnMock).toHaveBeenCalledTimes(1)
    expect(getCacheFnMock).toHaveBeenCalledTimes(2)
  })

  test('tries to lookup reverse exchange rate in cache', async () => {
    const client = new RatesClient('example.com', 'lorem', {})
    const cache = new RatesCache()

    const getCacheFnMock = RatesCache.mock.instances[0].get
    getCacheFnMock.mockReturnValueOnce(undefined)
    getCacheFnMock.mockReturnValueOnce(2)

    const getRatesClientFnMock = RatesClient.mock.instances[0].getRates
    getRatesClientFnMock.mockReturnValue(1)

    const service = new RatesService(client, cache)

    const result = await service.getRate('foo', 'bar')
    expect(result).toBe(0.5)
    expect(getRatesClientFnMock).not.toBeCalled()
    expect(getCacheFnMock.mock.calls[0]).toEqual(['foo', 'bar'])
    expect(getCacheFnMock.mock.calls[1]).toEqual(['bar', 'foo'])
  })
})

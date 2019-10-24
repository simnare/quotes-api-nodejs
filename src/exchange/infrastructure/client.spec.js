import axios from 'axios'
import RatesClient from './client'

jest.mock('axios')
jest.mock('winston')

describe('Rates client', () => {
  test('returns data.rates property of response object', async () => {
    const resp = {
      status: 200,
      data: {
        success: true,
        rates: { BAR: 42, BAZ: 0.99 }
      }
    }
    axios.get.mockResolvedValue(resp)
    const client = new RatesClient('foo', 'bar', { debug: jest.fn() })

    const result = await client.getRates('FOO')
    expect(result).toBe(resp.data.rates)
  })

  test('throws error when received not 200 response code', async () => {
    expect.assertions(1)
    const resp = {
      status: 400,
      data: {
        success: false
      }
    }
    axios.get.mockResolvedValue(resp)
    const client = new RatesClient('foo', 'bar', { debug: jest.fn() })
    try {
      await client.getRates('FOO')
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })
})

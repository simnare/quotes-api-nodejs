import Cache from './cache'
import Storage from 'ttl-mem-cache'

describe('RatesCache', () => {
  test('returns undefined if no entries found', () => {
    const cache = new Cache(new Storage())

    expect(cache.get('FOO', 'BAR')).toBe(undefined)
  })

  test('returns expected value if cache is set', () => {
    const cache = new Cache(new Storage())
    cache.set('FOO', { BAR: 3.14, BAZ: 1.23 })

    expect(cache.get('FOO', 'BAZ')).toBe(1.23)
  })

  test('stores exchange rates by base currency', () => {
    const cache = new Cache(new Storage())
    cache.set('FOO', { BAR: 42 })

    expect(cache.get('FOO', 'BAR')).toBe(42)
  })
})

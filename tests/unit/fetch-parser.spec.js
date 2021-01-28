import { fetchParser } from '@/utils/fetch-parser'
import fetchAuthorless from './fixtures/fetch-authorless.txt'

describe('Fetch parser', () => {
  it('should parse a message even if there is no author', () => {
    const result = fetchParser(fetchAuthorless)
    expect(result).toMatchSnapshot()
  })
})

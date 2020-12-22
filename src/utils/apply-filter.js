import RegexParser from 'regex-parser'
const regexCache = new WeakMap()

export const applyFilter = (filter, msg) => {
  let caseSensitive
  let caseInsensitive
  let regex
  switch (filter.type) {
    case 'author':
      if (filter.value === '') {
        return false
      }
      caseSensitive = filter.caseSensitive && msg.author === filter.author
      caseInsensitive = !filter.caseSensitive && msg.author.toLowerCase() === filter.value.toLowerCase()
      return caseSensitive || caseInsensitive

    case 'msgIncludes':
      if (filter.value === '') {
        return false
      }
      caseSensitive = filter.caseSensitive && msg.message.includes(filter.msgIncludes)
      caseInsensitive = !filter.caseSensitive && msg.message.toLowerCase().includes(filter.value.toLowerCase())
      return caseSensitive || caseInsensitive

    case 'isMember':
      return msg.authorType === 'member'

    case 'isModerator':
      return msg.authorType === 'moderator'
    case 'isOwner':
      return msg.authorType === 'owner'

    case 'isVerified':
      return Boolean(msg.verified)
    case 'isSuperChat':
      return msg.messageType === 'paid-message'
    case 'regex':
      try {
        regex = regexCache.get(filter)
        if (!regex) {
          regex = RegexParser(filter.regex)
          regexCache.set(filter, regex)
        }
        return regex.test(msg.message)
      } catch (e) {
        console.log('[ytcFilter] Regex error:', e)
      }
  }
  return false
}

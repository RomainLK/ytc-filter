import RegexParser from 'regex-parser'
const regexCache = new Map()

export const applyFilter = (filter, msg) => {
  if (!filter) {
    return false
  }
  let caseSensitive
  let caseInsensitive
  let regex
  switch (filter.type) {
    case 'author':
      if (filter.value === '' || filter.value == null || msg.author === '') {
        return false
      }
      caseSensitive = filter.caseSensitive && msg.author === filter.author
      caseInsensitive = !filter.caseSensitive && msg.author.toLowerCase() === filter.value.toLowerCase()
      return caseSensitive || caseInsensitive

    case 'msgIncludes':
      if (filter.value === '' || filter.value == null || msg.message === '') {
        return false
      }
      caseSensitive = filter.caseSensitive && msg.message.includes(filter.msgIncludes)
      caseInsensitive = !filter.caseSensitive && msg.message.toLowerCase().includes(filter.value.toLowerCase())
      return caseSensitive || caseInsensitive

    case 'isMember':
      return Boolean(msg.member)

    case 'isModerator':
      return Boolean(msg.moderator)
    case 'isOwner':
      return Boolean(msg.owner)

    case 'isVerified':
      return Boolean(msg.verified)
    case 'isSuperChat':
      return msg.messageType === 'paid-message'
    case 'regex':
      try {
        regex = regexCache.get(filter.value)
        if (!regex) {
          regex = RegexParser(filter.value)
          regexCache.set(filter.value, regex)
        }
        return regex.test(msg.message)
      } catch (e) {
        console.log('[ytcFilter] Regex error:', e)
      }
  }
  return false
}

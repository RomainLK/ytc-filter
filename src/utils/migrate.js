export const filterMigrate = filter => {
  if (filter.type) {
    return filter
  }
  const newFilter = {}
  for (const [key, value] of Object.entries(filter)) {
    if (key === 'caseSensitive') {
      newFilter.caseSensitive = value
    } else {
      newFilter.type = key
      newFilter.value = value
    }
  }
  return newFilter
}

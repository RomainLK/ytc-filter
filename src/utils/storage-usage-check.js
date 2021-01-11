export const storageUsageCheck = function(fn) {
  if (!chrome.storage.local.getBytesInUse) {
    console.log('[ytcFilter] Storage check unuvailable')
    return
  }
  const check = () => {
    chrome.storage.local.getBytesInUse(b => {
      if (b > chrome.storage.local.QUOTA_BYTES * 0.95) {
        const left = Math.round((1 - b / chrome.storage.local.QUOTA_BYTES) * 100)
        fn(left)
      }
    })
  }
  check()
  if (chrome.storage.local.getBytesInUse) {
    setInterval(check, 60000)
  }
}

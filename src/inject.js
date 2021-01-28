import { fetchParser } from '@/utils/fetch-parser'
console.log('[ytcFilter] Inject start')
const originalFetch = window.fetch

window.fetch = async (...args) => {
  //example url https://www.youtube.com/youtubei/v1/live_chat/get_live_chat?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8
  try {
    if (args[0].url.includes('live_chat/get_live_chat')) {
      const response = await originalFetch(...args)
      const text = await response.clone().text() // Going through text because wtf we get a nodeList here with json()
      const messages = fetchParser(text)
      for (const msg of messages) {
        document.dispatchEvent(new CustomEvent('chat-message-capture', { detail: msg }))
      }
      return response
    }
  } catch (e) {
    console.error(e)
  }
  return originalFetch(...args)
}

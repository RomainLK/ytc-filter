import 'arrive'
import { ytcMount } from '@/utils/mount'
console.log('[ytcFilter] Content loaded')

const isStudio = document.location.origin === 'https://studio.youtube.com'

const s = document.createElement('script')
s.src = chrome.extension.getURL('inject.js')
s.id = 'ytc-inject'
;(document.head || document.documentElement).appendChild(s)
// const isYtcPopout = new URLSearchParams(window.location.search).get('ytc')

const listener = async () => {
  console.log('[ytcFilter] DOM loaded.')

  // WIP popout
  // if (isYtcPopout) {
  //   console.log('[ytcFilter] ytcPopout detected')
  //   const style = document.createElement('link')
  //   style.rel = 'stylesheet'
  //   style.type = 'text/css'
  //   style.href = chrome.extension.getURL('content-style.css')
  //   ;(document.head || document.documentElement).appendChild(style)
  //   document.body.classList.add('ytc-popout')
  //   ///settingsMount(settings)
  //   //const ytApp = document.querySelector('yt-live-chat-app')
  // } else {
  //   ytcMount('Mount from DOM loaded')
  // }
  ytcMount('Mount from DOM loaded')
  if (isStudio) {
    document.removeEventListener('DOMContentLoaded', listener)
  } else {
    document.unbindArrive()
  }
}

if (isStudio) {
  document.arrive('#chat', listener)
} else {
  document.addEventListener('DOMContentLoaded', listener)
}
console.log('[ytcFilter] Content ended')

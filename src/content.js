import 'arrive'
import { ytcMount } from '@/utils/mount'
console.log('[ytcFilter] Content loaded')

const isStudio = document.location.origin === 'https://studio.youtube.com'

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

  const tryMount = count => {
    const result = ytcMount('Mount from DOM loaded, attempt: ' + count)
    if (!result && count < 20) {
      setTimeout(() => {
        tryMount(++count)
      }, 500)
      return
    }
    if (isStudio) {
      document.removeEventListener('DOMContentLoaded', listener)
    } else {
      document.unbindArrive()
    }

    const s = document.createElement('script')
    s.src = chrome.extension.getURL('inject.js')
    s.id = 'ytc-inject'
    ;(document.head || document.documentElement).appendChild(s)
    setTimeout(() => {
      if (document.querySelector('#ytc-filter') == null) {
        console.log('[ytcFilter] Loading message insertion')
        const loadingDiv = document.createElement('div')
        loadingDiv.classList.add('ytc-loading')
        loadingDiv.innerHTML = `ytcFilter didn't load in reasonable time. Click <span id="remount-ytc">here</span> to retry.`
        // const loadingMessage = document.createTextNode(`ytcFilter is loading. Click <a id="remount-ytc">here</a>  if it doesn't load properly `)
        // loadingDiv.appendChild(loadingMessage)
        document.body.insertBefore(loadingDiv, document.body.firstChild)
        const loadButton = document.querySelector('#remount-ytc')
        loadButton.addEventListener('click', ytcMount)
        console.log('[ytcFilter] Loading message inserted')
      }
    }, 1000)
  }
  tryMount(0)
}

if (isStudio) {
  document.arrive('#chat', listener)
} else {
  document.addEventListener('DOMContentLoaded', listener)
}
console.log('[ytcFilter] Content ended')

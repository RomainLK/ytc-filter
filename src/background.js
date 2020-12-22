import Vue from 'vue'
import '@/store'
import { createYtcPopout, createYoutubePopout } from '@/utils/create-popout'

// const app = new Vue({
//   store,
//   template: '<div></div>',
// })

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request) {
    switch (request.action) {
      case 'popout':
        createYtcPopout(request.payload)
        sendResponse('Success')
        break
      case 'yt-popout':
        createYoutubePopout(request.payload)
        break
    }
  }
})

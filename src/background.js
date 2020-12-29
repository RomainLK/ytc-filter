import '@/store'
import { createYtcPopout, createYoutubePopout } from '@/utils/create-popout'

// const app = new Vue({
//   store,
//   template: '<div></div>',
// })
let isBootstraping = false
const bootstrapCb = []

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request.action)
  if (request) {
    switch (request.action) {
      case 'bootstrap-start':
        if (isBootstraping) {
          bootstrapCb.push(sendResponse)
        } else {
          isBootstraping = true
          sendResponse()
        }
        break
      case 'bootstrap-end':
        if (bootstrapCb.length > 0) {
          bootstrapCb.splice(0, 1)[0]()
        } else {
          isBootstraping = false
        }
        break
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

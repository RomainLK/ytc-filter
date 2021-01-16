import '@/store'
import { createYtcPopout, createYoutubePopout } from '@/utils/create-popout'
import { debounce } from 'lodash'
// const app = new Vue({
//   store,
//   template: '<div></div>',
// })
let isBootstraping = false
const bootstrapCb = []

const onBootstrapEnd = () => {
  if (bootstrapCb.length > 0) {
    bootstrapCb.splice(0, 1)[0]()
  } else {
    isBootstraping = false
  }
}

const timeoutBootstrap = debounce(onBootstrapEnd, 5000)

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request) {
    switch (request.action) {
      case 'bootstrap-start':
        if (isBootstraping) {
          bootstrapCb.push(sendResponse)
        } else {
          isBootstraping = true
          sendResponse()
        }
        timeoutBootstrap()
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
      default:
    }
  }
})

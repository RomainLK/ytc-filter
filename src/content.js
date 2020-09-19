import ytcFilter from '@/components/ytc-filter'
import Vue from 'vue'
import 'arrive'

console.log('Loading ytcFilter')

const vchatter = new Vue({
  components: {
    ytcFilter,
  },
  template: `<ytc-filter></ytc-filter>`,
})

const isStudio = document.location.origin === 'https://studio.youtube.com'
const listener = async () => {
  const primaryContent = document.querySelector(isStudio ? '#chat.ytls-live-dashboard-page-renderer' : '#contents')
  const vueAnchor = document.createElement('div')
  primaryContent.prepend(vueAnchor)

  vchatter.$mount(vueAnchor)
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

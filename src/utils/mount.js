import Vue from 'vue'
import ytcFilter from '@/components/ytc-filter'
import store from '@/store'

const isStudio = document.location.origin === 'https://studio.youtube.com'

const vchatter = new Vue({
  components: {
    ytcFilter,
  },
  store,
  template: `<ytc-filter></ytc-filter>`,
})

export const ytcMount = (msg = 'No message') => {
  const primaryContent = document.querySelector(isStudio ? '#chat.ytls-live-dashboard-page-renderer' : '#contents')
  console.log('[ytcFilter] Primary element:', Boolean(primaryContent), ' Message', msg)
  if (primaryContent) {
    const vueAnchor = document.createElement('div')
    primaryContent.prepend(vueAnchor)
    vchatter.$mount(vueAnchor)
    console.log('[ytcFilter] Mounting')
    return true
  }
  return false
}

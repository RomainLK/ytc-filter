import ytcFilter from '@/components/ytc-filter'
import Vue from 'vue'

console.log('Loading ytcFilter')

const vchatter = new Vue({
  components: {
    ytcFilter,
  },
  template: `<ytc-filter></ytc-filter>`,
})

const listener = async () => {
  const primaryContent = document.querySelector('#contents')
  const vueAnchor = document.createElement('div')
  primaryContent.prepend(vueAnchor)

  vchatter.$mount(vueAnchor)
  document.removeEventListener('DOMContentLoaded', listener)
}
document.addEventListener('DOMContentLoaded', listener)

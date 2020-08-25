import Vchatter from '@/components/vchatter'
import Vue from 'vue'
const vchatter = new Vue({
  components: {
    Vchatter,
  },
  template: `<vchatter></vchatter>`,
})
const listener = async () => {
  const primaryContent = document.querySelector('#contents')
  const vueAnchor = document.createElement('div')
  primaryContent.prepend(vueAnchor)

  vchatter.$mount(vueAnchor)
  document.removeEventListener('DOMContentLoaded', listener)
}
document.addEventListener('DOMContentLoaded', listener)

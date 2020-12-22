import Vue from 'vue'
import { BootstrapVue } from 'bootstrap-vue'
import popout from '@/components/popout'
import store from '@/store'
console.log('[ytcFilter] build popout')

Vue.use(BootstrapVue)

const app = new Vue({
  components: {
    popout,
  },
  store,
  template: `<popout/>`,
  el: '#app',
})

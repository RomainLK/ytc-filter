<template>
  <div class="alert alert-dismissible" :class="alertType" v-show="show">
    <slot></slot>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="close">
      <span aria-hidden="true">x</span>
    </button>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: 'info',
    },
    alertKey: {
      type: String,
      required: true,
    },
  },
  computed: {
    alertType() {
      return 'alert-' + this.type
    },
    show() {
      if (this.$store.state.helpAlert[this.alertKey] != null) {
        return this.$store.state.helpAlert[this.alertKey]
      }
      return false
    },
  },
  methods: {
    close() {
      this.$store.commit('setHelpAlert', { value: false, key: this.alertKey })
    },
  },
}
</script>

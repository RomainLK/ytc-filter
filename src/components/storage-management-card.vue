<template>
  <b-card title="Storage management">
    <form>
      <b-form-group label="Delete video archive after X  days">
        <b-input type="number" placeholder="days" v-model="storageLifetime"> </b-input>
      </b-form-group>
      <b-form-group label="Limit to X message per video.">
        <b-input type="number" placeholder="Message limit" v-model="limitMsgPerVideo" min="0" step="1"> </b-input>
      </b-form-group>
      <b-alert variant="warning" show>
        You can put "0" for unlimited, but take care of not hitting the storage limit, else the extension will no longer work.
      </b-alert>
    </form>
  </b-card>
</template>
<script>
export default {
  computed: {
    limitMsgPerVideo: {
      get() {
        return this.$store.getters.global.limitMsgPerVideo
      },
      set(value) {
        if (!value) {
          value = 0
        }
        this.$store.commit('updateGlobal', { value, path: 'limitMsgPerVideo' })
      },
    },
    storageLifetime: {
      get() {
        return this.$store.getters.global.storageLifetime
      },
      set(value) {
        if (!value) {
          value = 0
        }
        this.$store.commit('updateGlobal', { value, path: 'storageLifetime' })
      },
    },
  },
}
</script>

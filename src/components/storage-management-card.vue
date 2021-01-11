<template>
  <b-card title="Storage management">
    <form>
      <b-form-group label="Delete video archive after X  days">
        <b-input type="number" placeholder="days" v-model="storageLifeTime"> </b-input>
      </b-form-group>
      <b-form-group label="Limit to X message per video.">
        <b-input type="number" placeholder="Message limit" v-model="limitMsgPerVideo"> </b-input>
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
        this.$store.commit('updateGlobal', { value, path: 'limitMsgPerVideo' })
      },
    },
    storageLifeTime: {
      get() {
        return this.$store.getters.global.storageLifeTime
      },
      set(value) {
        this.$store.commit('updateGlobal', { value, path: 'storageLifeTime' })
      },
    },
  },
}
</script>

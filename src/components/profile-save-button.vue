<template>
  <div>
    <button class="btn btn-primary" @click="openSaveModal">
      {{ label }}
    </button>
    <b-modal v-model="showSaveModal" title="Save" ok-title="Save" @ok="onSaveProfile">
      <form class="form">
        <div class="form-check mb-2">
          <input id="save-create" type="radio" class="form-check-input" v-model="saveMode" value="create" />
          <label class="form-check-label" for="save-create">
            <strong>Create</strong>
          </label>
          <input type="text" v-model="saveName" class="form-control" :class="{ 'is-invalid': invalidCreateFeedback }" :disabled="saveMode !== 'create'" />
          <div class="invalid-feedback">
            {{ invalidCreateFeedback }}
          </div>
        </div>
        <div class="form-check mb-2" v-show="profilesLength > 0 && canUpdate">
          <input id="save-update" class="form-check-input" type="radio" v-model="saveMode" value="update" />
          <label class="form-check-label" for="save-update">
            <strong>Update</strong>
          </label>
          <select v-model="selectedProfile" class="form-control" :class="{ 'is-invalid': invalidUpdateFeedback }" :disabled="saveMode !== 'update'">
            <option :value="null">Select a preset</option>
            <option v-for="(profile, key) of profiles" :key="key" :value="profile">{{ profile.name }} {{ key === $store.state.global.globalDefault ? '(Global)' : '' }}</option>
          </select>
          <div class="invalid-feedback">
            {{ invalidUpdateFeedback }}
          </div>
        </div>
        <!--div class="form-check">
          <input id="save-include-embedded-options" class="form-check-input" type="checkbox" v-model="saveIncludeEmbeddedOptions" />
          <label class="form-check-label" for="save-include-embedded-options">
            Include embedded options
          </label>
        </div-->
      </form>
    </b-modal>
  </div>
</template>
<script>
export default {
  props: {
    canUpdate: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
      default() {
        return 'Create or update preset'
      },
    },
    filters: {
      type: Array,
      default() {
        return []
      },
    },
    options: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      selectedProfile: null,
      showSaveModal: false,
      saveMode: 'create',
      saveName: '',
      saveIncludeEmbeddedOptions: true,
      invalidCreateFeedback: '',
      invalidUpdateFeedback: '',
    }
  },
  computed: {
    profiles() {
      return this.$store.getters.profiles
    },
    hasSelected() {
      return this.selectedProfile != null
    },
    currentVideoSettings() {
      return this.$store.state.videoSettings[this.videoId]
    },
    profilesLength() {
      return Object.keys(this.profiles).length
    },
    profileDefaultChannel() {
      if (this.selectedProfile) {
        return Object.values(this.$store.getters.global.defaultPerChannel).filter(info => info.profileKey === this.selectedProfile.key)
      }
      return []
    },
    channelId() {
      return this.currentVideoSettings?.channelId
    },
    currentFilters() {
      return this.selectedProfile.filters
    },
    currentOptions() {
      return this.selectedProfile.options
    },
  },
  methods: {
    openSaveModal() {
      this.saveMode = this.selectedProfile ? 'update' : 'create'
      this.resetSaveFeedback()
      this.showSaveModal = true
    },
    resetSaveFeedback() {
      this.invalidCreateFeedback = ''
      this.invalidUpdateFeedback = ''
    },
    onSaveProfile(e) {
      this.resetSaveFeedback()
      let success
      if (this.saveMode === 'update') {
        success = this.updateProfile()
      }
      if (this.saveMode === 'create') {
        success = this.createProfile()
      }
      if (!success) {
        e.preventDefault()
      }
      this.$bvToast.toast(`"Profile ${this.selectedProfile.name}" was saved`, { title: 'Success' })
      this.$emit('save', this.selectedProfile)
    },

    generateProfile(name, key) {
      key =
        key ||
        Math.random()
          .toString(36)
          .substr(2, 9)
      const profile = {
        name,
        key,
        filters: [...this.filters],
      }
      if (this.saveIncludeEmbeddedOptions) {
        profile.options = { ...this.options }
      }
      return profile
    },

    updateProfile() {
      if (this.selectedProfile == null) {
        this.invalidUpdateFeedback = 'A profile must be selected'
        return false
      }
      this.$store.commit('addProfile', this.generateProfile(this.selectedProfile.name, this.selectedProfile.key))
      return true
    },
    createProfile() {
      if (this.saveName === '') {
        this.invalidCreateFeedback = 'Profile name must be filled'
        return false
      }
      if (
        Object.values(this.profiles)
          .map(p => p.name)
          .includes(this.saveName)
      ) {
        this.invalidCreateFeedback = 'This profile name is already used'
        return false
      }
      const newProfile = this.generateProfile(this.saveName)
      this.$store.commit('addProfile', newProfile)
      this.selectedProfile = newProfile
      return true
    },
  },
}
</script>

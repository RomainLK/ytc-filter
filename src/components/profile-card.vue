<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Profiles</h5>
      <help-alert alert-key="profileHelp">
        Profiles are a group of filters and options which you can reuse between videos. If you wish, we can add a default set of profiles for translation, languages, and staff.
        <button class="btn btn-success" @click="addDefaultProfile">Add default profiles</button>
      </help-alert>
      <div class="form-inline">
        <select v-model="selectedProfile" class="form-control">
          <option :value="null" disabled>Select a profile</option>
          <option v-for="(profile, key) of profiles" :key="key" :value="profile">
            {{ profile.name }} {{ key === $store.state.global.globalDefault ? '(Global)' : '' }} {{ isDefaultForCurrentChannel(profile) ? '(Channel)' : '' }}
          </option>
        </select>
        <button class="btn btn-primary ml-2" @click="openSaveModal">
          Create or update profile
        </button>
      </div>
      <div class="my-2">
        <button class="btn btn-primary" :disabled="!hasSelected" @click="applyProfile">Apply</button>
        <button class="btn btn-danger" :disabled="!hasSelected" @click="deleteProfile">Delete</button>
      </div>
      <div class="my-2">
        <help-alert alert-key="profileDefaultHelp">
          Default profile will automatically apply a profile to a new video. If set, ytcFilter will try to apply the channel profiles, otherwise the global profile.
        </help-alert>
        <button class="btn btn-secondary" :disabled="!hasSelected" @click="setAsChannelDefault">Set as channel default</button>
        <button class="btn btn-secondary" :disabled="!hasSelected" @click="setAsGlobalDefault">Set as global default</button>
      </div>
    </div>
    <div v-show="profileDefaultChannel.length > 0" class="px-4">
      <p>This profile is used by default on the following channels:</p>
      <ul class="unstyled-list">
        <li v-for="defaultInfo in profileDefaultChannel" :key="defaultInfo.channelId">
          <a v-if="defaultInfo.channelId !== 'Studio'" :href="'https://www.youtube.com/channel/' + defaultInfo.channelId" target="_blank">
            {{ defaultInfo.channelName }}
          </a>
          <span v-else>
            {{ defaultInfo.channelName }}
          </span>
        </li>
      </ul>
    </div>

    <b-modal v-model="showSaveModal" title="Save" ok-title="Save" @ok="onSaveProfile">
      <p>Your current filters and options will be used for saving.</p>
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
        <div class="form-check mb-2" v-show="profilesLength > 0">
          <input id="save-update" class="form-check-input" type="radio" v-model="saveMode" value="update" />
          <label class="form-check-label" for="save-update">
            <strong>Update</strong>
          </label>
          <select v-model="selectedProfile" class="form-control" :class="{ 'is-invalid': invalidUpdateFeedback }" :disabled="saveMode !== 'update'">
            <option :value="null">Select a profile</option>
            <option v-for="(profile, key) of profiles" :key="key" :value="profile">{{ profile.name }} {{ key === $store.state.global.globalDefault ? '(Global)' : '' }}</option>
          </select>
          <div class="invalid-feedback">
            {{ invalidUpdateFeedback }}
          </div>
        </div>
        <div class="form-check">
          <input id="save-include-embedded-options" class="form-check-input" type="checkbox" v-model="saveIncludeEmbeddedOptions" />
          <label class="form-check-label" for="save-include-embedded-options">
            Include embedded options
          </label>
        </div>
      </form>
    </b-modal>
  </div>
</template>
<script>
import helpAlert from './help-alert.vue'

export default {
  components: { helpAlert },
  props: {
    videoId: {
      type: String,
      required: true,
    },
    feedName: {
      type: String,
      default: 'default',
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
  },
  methods: {
    isDefaultForCurrentChannel(profile) {
      const channelId = this.currentVideoSettings.channelId
      if (!profile) {
        return null
      }
      return profile.key === this.$store.getters.global.defaultPerChannel[channelId]?.profileKey
    },
    applyProfile() {
      this.$store.commit('applyProfile', { videoId: this.videoId, feedName: this.feedName, profileKey: this.selectedProfile.key })
      this.$bvToast.toast(`Profile "${this.selectedProfile.name}" was applied`, { title: 'Success' })
    },
    setAsGlobalDefault() {
      this.$store.commit('setGlobalDefault', this.selectedProfile.key)
      this.$bvToast.toast(`Profile "${this.selectedProfile.name}" was set as global default`, { title: 'Success' })
    },
    setAsChannelDefault() {
      this.$store.commit('setChannelDefault', {
        channelId: this.currentVideoSettings.channelId,
        profileKey: this.selectedProfile.key,
        channelName: this.currentVideoSettings.channelName,
      })
      this.$bvToast.toast(`Profile "${this.selectedProfile.name}" was set as channel default`, { title: 'Success' })
    },
    async deleteProfile() {
      const ok = await this.$bvModal.msgBoxConfirm(`Are you sure you want to delete the profile "${this.selectedProfile.name}"`, { title: 'Warning', okVariant: 'danger' })
      if (ok) {
        this.$store.commit('deleteProfile', this.selectedProfile.key)
        this.selectedProfile = null
        this.$bvToast.toast(`Profile "${this.selectedProfile.name}" was deleted`, { title: 'Success' })
      }
    },
    addDefaultProfile() {
      this.$store.commit('loadDefaultProfile')
      this.$store.commit('setHelpAlert', { key: 'profileHelp', value: false })
      this.$bvToast.toast(`Default profiles were loaded`, { title: 'Success' })
    },
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
        filters: [...this.currentVideoSettings.feeds[this.feedName].filters],
      }
      if (this.saveIncludeEmbeddedOptions) {
        profile.options = { ...this.currentVideoSettings.options }
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

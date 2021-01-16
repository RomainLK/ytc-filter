<template>
  <div>
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">Preset</h5>
        <help-alert alert-key="profileHelp">
          Preset are a group of filters and options which you can reuse between videos. If you wish, we can add a default set of presets for translation, languages, and staff.
          <button class="btn btn-success" @click="addDefaultProfile">Add default presets</button>
        </help-alert>
        <div class="form-inline">
          <select v-model="selectedProfile" class="form-control">
            <option :value="null" disabled>Select a preset</option>
            <option v-for="(profile, key) of profiles" :key="key" :value="profile">
              {{ profile.name }} {{ key === $store.state.global.globalDefault ? '(Global)' : '' }} {{ isDefaultForCurrentChannel(profile) ? '(Channel)' : '' }}
            </option>
          </select>
          <profile-save-button class="ml-2" :can-update="false" label="Create" @save="onCreate" />
        </div>
        <div class="my-2">
          <button class="btn btn-primary" :disabled="!hasSelected" @click="applyProfile" title="Replace current video's filters and options">Apply</button>
          <button class="btn btn-primary" :disabled="!hasSelected" @click="appendProfile" title="Add filters to current video's">Append filters</button>
          <button class="btn btn-danger" :disabled="!hasSelected" @click="deleteProfile">Delete</button>
        </div>
        <div class="my-2">
          <help-alert alert-key="profileDefaultHelp">
            Default preset will automatically apply a preset to a new video. If set, ytcFilter will try to apply the channel preset, otherwise the global preset.
          </help-alert>
          <button class="btn btn-secondary" :disabled="!hasSelected" @click="toggleGlobalDefault">
            {{ isCurrentGlobalDefault ? 'Unset as global default' : 'Set as global default' }}
          </button>
          <button class="btn btn-secondary" v-show="!isDefaultForCurrentChannel(selectedProfile)" :disabled="!hasSelected || channelId == null" @click="setAsChannelDefault">
            Set as channel default
          </button>
        </div>
      </div>
      <div v-show="profileDefaultChannel.length > 0" class="px-4">
        <p>This preset is used by default on the following channels:</p>
        <ul class="unstyled-list">
          <li v-for="defaultInfo in profileDefaultChannel" :key="defaultInfo.channelId">
            <a v-if="defaultInfo.channelId !== 'Studio'" :href="'https://www.youtube.com/channel/' + defaultInfo.channelId" target="_blank">
              {{ defaultInfo.channelName }}
            </a>
            <span v-else>
              {{ defaultInfo.channelName }}
            </span>
            <button class="btn btn-secondary btn-sm" @click="$store.commit('unsetChannelDefault', defaultInfo.channelId)">
              X
            </button>
          </li>
        </ul>
      </div>
    </div>

    <filter-card v-if="selectedProfile" class="mb-3" :filters="currentFilters" @change="onFiltersChange"></filter-card>
    <embedded-options-card v-if="selectedProfile" :options="currentOptions" @change="onOptsChange" :key="'profile'"></embedded-options-card>
  </div>
</template>
<script>
import helpAlert from './help-alert.vue'
import filterCard from '@/components/filter-card'
import profileSaveButton from '@/components/profile-save-button'
import embeddedOptionsCard from '@/components/embedded-options-card'
import ProfileSaveButton from './profile-save-button.vue'

export default {
  components: { helpAlert, embeddedOptionsCard, filterCard, profileSaveButton, ProfileSaveButton },
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
    channelId() {
      return this.currentVideoSettings?.channelId
    },
    currentFilters() {
      return this.selectedProfile.filters
    },
    currentOptions() {
      return this.selectedProfile.options
    },
    isCurrentGlobalDefault() {
      return this.$store.state.global.globalDefault === this.selectedProfile?.key
    },
  },
  methods: {
    isDefaultForCurrentChannel(profile) {
      if (!profile) {
        return null
      }
      return profile.key === this.$store.getters.global.defaultPerChannel[this.channelId]?.profileKey
    },
    applyProfile() {
      this.$store.commit('applyProfile', { videoId: this.videoId, feedName: this.feedName, profileKey: this.selectedProfile.key })
      this.$bvToast.toast(`Preset "${this.selectedProfile.name}" was applied to current video`, { title: 'Success' })
    },
    appendProfile() {
      this.$store.commit('appendProfile', { videoId: this.videoId, feedName: this.feedName, profileKey: this.selectedProfile.key })
      this.$bvToast.toast(`The filters from the "${this.selectedProfile.name}" profile were appended`, { title: 'Success' })
    },
    toggleGlobalDefault() {
      if (this.isCurrentGlobalDefault) {
        this.$store.commit('setGlobalDefault', null)
        this.$bvToast.toast(`Preset "${this.selectedProfile.name}" is no longer the global default`, { title: 'Success' })
      } else {
        this.$store.commit('setGlobalDefault', this.selectedProfile.key)
        this.$bvToast.toast(`Preset "${this.selectedProfile.name}" was set as global default`, { title: 'Success' })
      }
    },
    setAsChannelDefault() {
      console.log('[ytcFilter] Set as channel default', this.videoId, this.currentVideoSettings.channelId, this.currentVideoSettings.channelName)
      this.$store.commit('setChannelDefault', {
        channelId: this.currentVideoSettings.channelId,
        profileKey: this.selectedProfile.key,
        channelName: this.currentVideoSettings.channelName,
      })
      this.$bvToast.toast(`Preset "${this.selectedProfile.name}" was set as channel default`, { title: 'Success' })
    },
    async deleteProfile() {
      const ok = await this.$bvModal.msgBoxConfirm(`Are you sure you want to delete the profile "${this.selectedProfile.name}"`, { title: 'Warning', okVariant: 'danger' })
      if (ok) {
        this.$store.commit('deleteProfile', this.selectedProfile.key)
        this.selectedProfile = null
        this.$bvToast.toast(`Preset "${this.selectedProfile.name}" was deleted`, { title: 'Success' })
      }
    },
    addDefaultProfile() {
      this.$store.commit('loadDefaultProfile')
      this.$store.commit('setHelpAlert', { key: 'profileHelp', value: false })
      this.$bvToast.toast(`Default presets were loaded`, { title: 'Success' })
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
      this.$bvToast.toast(`"Preset ${this.selectedProfile.name}" was saved`, { title: 'Success' })
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
        this.invalidUpdateFeedback = 'A preset must be selected'
        return false
      }
      this.$store.commit('addProfile', this.generateProfile(this.selectedProfile.name, this.selectedProfile.key))
      return true
    },
    createProfile() {
      if (this.saveName === '') {
        this.invalidCreateFeedback = 'Preset name must be filled'
        return false
      }
      if (
        Object.values(this.profiles)
          .map(p => p.name)
          .includes(this.saveName)
      ) {
        this.invalidCreateFeedback = 'This preset name is already used'
        return false
      }
      const newProfile = this.generateProfile(this.saveName)
      this.$store.commit('addProfile', newProfile)
      this.selectedProfile = newProfile
      return true
    },
    onCreate(profile) {
      this.selectedProfile = profile
    },
    onFiltersChange() {
      this.$store.commit('addProfile', this.selectedProfile)
    },
    onOptsChange(options) {
      this.$store.commit('addProfile', this.selectedProfile)
    },
  },
}
</script>

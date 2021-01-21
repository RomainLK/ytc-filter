<template>
  <div>
    <div class="container-fluid">
      <div class="row mt-3">
        <div id="ytc-filter" class="col message-column" :class="{ 'limited-width': displaySettings }">
          <h5 class="message-column-title">{{ displayedVideoName }}</h5>
          <message-list :video-id="displayedVideoId" :is-popout="true">
            <button class="btn btn-primary  sm-btn mr-2" @click="$store.commit('toggleDarkMode')">{{ darkMode ? 'Dark' : 'Light' }}</button>
            <b-button :pressed.sync="displaySettings" variant="primary" class="sm-btn"> {{ displaySettings ? 'Hide' : 'Show' }} settings</b-button>
          </message-list>
        </div>
        <div class="col py-2 pr-5 settings-column" v-show="displaySettings">
          <b-tabs content-class="mt-3">
            <b-tab title="Current video" active @click="selectedArchiveId = null">
              <b-alert variant="warning" :show="channelId == null">
                ytcFilter is running in degraded mode because it couldn't get channel and video information. This is normal if you are using ytcFilter outside of Youtube.com
              </b-alert>
              <filter-card class="mb-3" :filters="currentFilters" @change="onFiltersChange" :video-id="videoId" />
              <embedded-options-card class="mb-3" :options="currentVideoSettings.options" @change="onOptionsChange" :key="'currentVideoOptions'"></embedded-options-card>
              <profile-save-button :filters="currentFilters" :options="currentVideoSettings.options" />
            </b-tab>
            <b-tab title="Preset management">
              <profile-card class="mb-3" :video-id="videoId" />
            </b-tab>
            <b-tab title="Options">
              <storage-management-card />
            </b-tab>
            <b-tab title="Archive">
              <ul class="list-unstyled">
                <li v-for="channel in $store.getters.channelArchive" :key="channel.id" class="mb-4">
                  <a :href="'https://www.youtube.com/channel/' + channel.id" target="_blank">{{ channel.name }}</a>
                  <ul class="mt-1">
                    <li v-for="video in channel.videos" :key="video.id" class="mb-2">
                      <button class="btn btn-sm btn-secondary mr-2" @click="selectedArchiveId = video.id">Load archive</button>
                      <a :href="'https://www.youtube.com/watch?v=' + video.id" target="_blank">{{ video.name || video.id }}</a>
                    </li>
                  </ul>
                </li>
              </ul>
              <p>Extension storage (not real time): {{ usedBytes }}/{{ quotaByte }} ({{ storagePercent }}%)</p>
              <button class="btn btn-danger" @click="clearArchive">
                Clear Archive
              </button>
            </b-tab>
            <b-tab title="Help">
              <p>
                Version: {{ version }}
                <b-button variant="primary" size="sm" class="ml-3" @click="showChangeLog = true">
                  Changelog
                </b-button>
              </p>
              <p>Extension storage (not real time): {{ usedBytes }}/{{ quotaByte }} ({{ storagePercent }}%)</p>
              <p>
                For support, bug report, or feedback, you can use these channels to contact the developer:
              </p>
              <ul>
                <li><a href="https://discord.gg/P6DUeuhSjU" target="_blank">Discord</a></li>
                <li><a href="https://github.com/RomainLK/ytc-filter" target="_blank">Github</a></li>
              </ul>
              <div class="card">
                <div class="card-body">
                  <h4 class="card-title">Factory settings</h4>
                  <button type="button" class="btn btn-success" @click="showWelcome = true">
                    Show welcome message
                  </button>
                  <button type="button" class="btn btn-success" @click="onResetHintMessages">
                    Reset hint messages
                  </button>
                  <button type="button" class="btn btn-warning" @click="onLoadDefaultProfiles">
                    Load default presets
                  </button>

                  <button type="button" class="btn btn-danger" @click="onFactoryReset">
                    Full reset
                  </button>
                  <p>After a full reset, you will need to refresh every instance of ytcFilter by either reloading the pages or restarting your browser</p>
                </div>
              </div>
            </b-tab>
          </b-tabs>
        </div>
      </div>
    </div>
    <b-modal v-model="showChangeLog" title="Changelog" size="lg" ok-only>
      <template #default>
        <div v-html="changelog"></div>
      </template>
    </b-modal>
    <b-modal v-model="showWelcome" size="lg" no-close-on-backdrop ok-only :title="`ytcFilter ${version} 'Kanata'`" @hidden="onHiddenWelcome">
      <p>
        2.1.0 is out after a rocky release of 2.0.x. Thanks for bearing with the huge changes which sadly brought so many issues.
      </p>

      <p>
        If you have never set any presets before, ytcFilter can preinstall some for common usage like translation tagged messages, languages, and staff. If you have been using
        2.0.x, you can also load them again in order to fix the "English tagged messages" preset's filter.
        <button class="btn btn-success btn-sm" @click="addDefaultProfiles">Add default presets</button>
      </p>

      <p>
        Contact for feedback, support, bug report or help with development and beta: <a href="https://discord.gg/P6DUeuhSjU" target="_blank">Discord</a> or
        <a href="https://github.com/RomainLK/ytc-filter" target="_blank">Github</a>
      </p>

      <h4>2.1 new features and changes</h4>
      <ul>
        <li>
          ytcFilter will now switch automatically to a Fetch interceptor after sometime in the chat. This has several effects: better performance without hitting the Youtube
          server/bandwidth penalty, more precise so no more message/badge mixing, and it will seem to "predict" future messages. Note that since it's faster that Youtube chat, if
          you add a new filter live, it will look like the filter isn't immediately active. Session stats will also increase more sporadically.
        </li>
        <li>
          Integrate Youtube's block/report menu in current session of embedded ytcFilter so as to fight against spam even for those without the extension. Make Youtube chat a
          better place! Note that it may take some time when ytcFilter switch to the Fetch interceptor as interceptor is faster than Youtube's livechat. Also, due to Youtube's
          limitation and performance, the menu can't be used if the message is no longer in the chat, so it's not permanent, and may also be missing..
        </li>
        <li>
          Drag resize of embedded ytcFIlter, replacing the slider in embedded ytcFilter
        </li>
        <li>
          Configurable storage management to clean the storage automatically. Default to 100 messages per video and a lifetime of 7 days.
        </li>
        <li>
          Alert every minute if less than 5% of storage is available (Not supported in Firefox)
        </li>
      </ul>

      <p>
        3.0.0 is on the horizon and should bring filter combination allowing to both allow and block messages based on new conditions, like an emote filter.
      </p>

      <h4>2.1.3 Bugfixes</h4>
      <ul>
        <li>Remove block/report button cleanly so that Youtube's livechat can recycle them</li>
        <li>Optimize migration to 2.1.x. It should prevent high CPU/RAM usage during migration, if you haven't migrated already.</li>
        <li>Fix filtering by role in other language than English</li>
        <li>Avoid disconnecting chat when other extensions which require to patch Fetch like LiveTL are enabled</li>
      </ul>

      <b-button variant="primary" class="ml-3" @click="showChangeLog = true">
        Full changelog
      </b-button>
    </b-modal>
  </div>
</template>
<script>
import messageList from '@/components/message-list'
import profileCard from '@/components/profile-card'
import filterCard from '@/components/filter-card'
import embeddedOptionsCard from '@/components/embedded-options-card'
import profileSaveButton from '@/components/profile-save-button'
import { debounce } from 'lodash'
import manifest from '@/manifest.json'
import changelog from '@/../changelog.md'
import storageManagementCard from '@/components/storage-management-card'
import { storageUsageCheck } from '@/utils/storage-usage-check'

export default {
  components: {
    messageList,
    profileCard,
    filterCard,
    embeddedOptionsCard,
    profileSaveButton,
    storageManagementCard,
  },
  data() {
    return {
      displaySettings: false,
      usedBytes: 0,
      selectedArchiveId: null,
      version: manifest.version,
      changelog,
      showChangeLog: false,
      showWelcome: false,
    }
  },
  async mounted() {
    console.log('[ytcFilter] popout mounting. channelId:', this.channelId, ' videoId:', this.videoId, ' channelName:', this.channelName)
    storageUsageCheck(left => {
      this.$bvToast.toast(`WARNING! Less than ${left}% of storage space is left in ytcFilter. Please check the Popout > Archive tab to free some space.`, {
        title: 'Warning',
        variant: 'danger',
        noAutoHide: true,
      })
    })
    this.getUsedBytes()
    window.addEventListener(
      'resize',
      debounce(() => {
        chrome.windows.getCurrent(w => {
          const size = {
            height: w.height,
            width: w.width,
          }
          if (this.displaySettings) {
            this.$store.commit('setFullPopoutSize', size)
          } else {
            this.$store.commit('setCompactPopoutSize', size)
          }
        })
      }, 500)
    )
    await new Promise(resolve => setTimeout(resolve, 500))
    this.showWelcome = this.$store.state.helpAlert.welcome
  },
  computed: {
    storagePercent() {
      if (!chrome.storage.local.getBytesInUse) {
        return 'N/A'
      }
      return Math.round((1 - this.usedBytes / this.quotaByte) * 100)
    },
    quotaByte() {
      if (chrome) {
        return chrome.storage.local.QUOTA_BYTES
      } else {
        return ''
      }
    },
    channelId() {
      return this.getUrlParams('cid') === 'null' ? null : this.getUrlParams('cid')
    },
    videoId() {
      return this.getUrlParams('vid')
    },
    videoName() {
      return decodeURIComponent(this.getUrlParams('vname')) === 'null' ? 'Video name unavailable' : decodeURIComponent(this.getUrlParams('vname'))
    },
    displayedVideoId() {
      return this.selectedArchiveId || this.videoId
    },
    displayedVideoName() {
      if (this.displayedVideoId === this.videoId) {
        return this.videoName
      }
      return 'Archive: ' + this.$store.state.videoSettings[this.selectedArchiveId].name
    },
    channelName() {
      return this.getUrlParams('cname')
    },

    youtubeLiveChatUrl() {
      return encodeURI(`https://www.youtube.com/live_chat?v=${this.videoId}&embed_domain=${window.location.origin}`)
    },
    currentVideoSettings() {
      return this.$store.state.videoSettings[this.videoId] || {}
    },
    currentFilters() {
      return this.currentVideoSettings?.feeds?.default?.filters
    },
    darkMode() {
      return this.$store.getters.global.darkMode
    },
  },
  watch: {
    'currentFilters.length': function(value) {
      if (value === 0) {
        this.displaySettings = true
      }
    },

    displaySettings(value) {
      if (value) {
        this.updateWindow(this.$store.getters.fullPopoutSize)
      } else {
        this.updateWindow(this.$store.getters.compactPopoutSize)
      }
    },
    darkMode(value) {
      if (value) {
        document.body.classList.add('dark-mode')
      } else {
        document.body.classList.remove('dark-mode')
      }
    },
  },
  methods: {
    updateWindow(options, cb = () => {}) {
      chrome.windows.getCurrent(w => {
        chrome.windows.update(w.id, options, cb)
      })
    },
    getUsedBytes() {
      if (chrome.storage.local.getBytesInUse) {
        chrome.storage.local.getBytesInUse(b => (this.usedBytes = b))
      } else {
        this.usedBytes = 'Unsupported with Firefox'
      }
    },
    getUrlParams(paramName) {
      const queryString = window.location.search
      const urlParams = new URLSearchParams(queryString)
      return urlParams.get(paramName)
    },
    clearArchive() {
      this.$store.commit('clearVideoSettings')
      setTimeout(() => this.getUsedBytes(), 1000)
    },
    onFiltersChange() {
      this.$store.commit('updateFilters', { videoId: this.videoId, feedName: 'default', filters: this.currentFilters })
    },
    onOptionsChange(options) {
      this.$store.commit('setVideoOptions', { videoId: this.videoId, options })
    },
    async onLoadDefaultProfiles() {
      const ok = await this.$bvModal.msgBoxConfirm('Any modifications to default presets you have made will be overriden. Continue?', { title: 'Warning' })
      if (ok) {
        this.$store.commit('loadDefaultProfile')
        this.$bvToast.toast(`Default presets were loaded`, { title: 'Success' })
      }
    },
    onResetHintMessages() {
      this.$store.commit('resetHelpAlert')
    },
    async onFactoryReset() {
      const ok = await this.$bvModal.msgBoxConfirm('All your configuration will be deleted. After the reset, you will need to reload every pages with ytcFilter loaded.', {
        title: 'Warning',
        okVariant: 'danger',
      })
      if (ok) {
        this.$store.commit('factoryReset')
        this.$bvToast.toast(`Factory reset done. Please close this window.`, { title: 'Success' })
      }
    },
    addDefaultProfiles() {
      this.$store.commit('loadDefaultProfile')
      this.$store.commit('setHelpAlert', { key: 'profileHelp', value: false })
      this.$bvToast.toast(`Default presets were loaded`, { title: 'Success' })
    },
    onHiddenWelcome() {
      this.$store.commit('setHelpAlert', {
        key: 'welcome',
        value: false,
      })
    },
    // showChangeLog() {
    //   this.$bvModal.msgBoxOk(changelog, {
    //     title: 'Changelog',
    //   })
    // },
  },
}
</script>

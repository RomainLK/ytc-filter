<template>
  <div>
    <div class="container-fluid">
      <div class="row mt-3">
        <div id="ytc-filter" class="col message-column">
          <h5 class="message-column-title">{{ displayedVideoName }}</h5>
          <message-list :video-id="displayedVideoId" :is-popout="true" />
        </div>
        <div class="col py-2 pr-5 settings-column">
          <b-tabs content-class="mt-3">
            <b-tab title="Current video" active @click="selectedArchiveId = null">
              <profile-card class="mb-3" :video-id="videoId" />
              <filter-card class="mb-3" :filters="currentFilters" @change="onFiltersChange" />
              <embedded-options-card :options="currentVideoSettings.options" @change="onOptionsChange" />
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
              <p>Extension storage (not real time): {{ usedBytes }}/{{ quotaByte }}</p>
              <button class="btn btn-danger" @click="clearArchive">
                Clear Archive
              </button>
            </b-tab>
            <b-tab title="Help">
              <p>
                For support, bug report, or feedback, you can use these channels to contact the developer:
              </p>
              <ul>
                <li><a href="https://discord.gg/P6DUeuhSjU" target="_blank">Discord</a></li>
                <li><a href="https://github.com/RomainLK/ytc-filter" target="_blank">Github</a></li>
              </ul>
              <p>
                Please check the <a href="https://github.com/RomainLK/ytc-filter/wiki" target="_blank">wiki</a>
                for guide and help. Documentation applies to embedded ytcFilter
              </p>
              <div class="card">
                <div class="card-body">
                  <h4 class="card-title">Factory settings</h4>
                  <button class="btn btn-success" @click="onResetHintMessages">
                    Reset hint messages
                  </button>
                  <button class="btn btn-warning" @click="onLoadDefaultProfiles">
                    Load default profiles
                  </button>

                  <button class="btn btn-danger" @click="onFactoryReset">
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
  </div>
</template>
<script>
import messageList from '@/components/message-list'
import profileCard from '@/components/profile-card'
import filterCard from '@/components/filter-card'
import embeddedOptionsCard from '@/components/embedded-options-card'

export default {
  components: {
    messageList,
    profileCard,
    filterCard,
    embeddedOptionsCard,
  },
  data() {
    return {
      usedBytes: null,
      selectedArchiveId: null,
    }
  },
  mounted() {
    console.log('[ytcFilter] popout mounting. channelId:', this.channelId, ' videoId:', this.videoId, ' channelName:', this.channelName)
    this.getUsedBytes()
  },
  computed: {
    quotaByte() {
      if (chrome) {
        return chrome.storage.local.QUOTA_BYTES
      } else {
        return ''
      }
    },
    channelId() {
      return this.getUrlParams('cid')
    },
    videoId() {
      return this.getUrlParams('vid')
    },
    videoName() {
      return decodeURIComponent(this.getUrlParams('vname'))
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
  },
  methods: {
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
      const ok = await this.$bvModal.msgBoxConfirm('Any modifications to default profiles you have made will be overriden. Continue?', { title: 'Warning' })
      if (ok) {
        this.$store.commit('loadDefaultProfile')
        this.$bvToast.toast(`Default profiles were loaded`, { title: 'Success' })
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
  },
}
</script>

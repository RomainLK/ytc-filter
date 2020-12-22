<template>
  <div>
    <div class="container-fluid">
      <div class="row mt-3">
        <div id="ytc-filter" class="col message-column">
          <h5>{{ displayedVideoName }}</h5>
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
                <li v-for="channel in $store.getters.channelArchive" :key="channel.id">
                  <a :href="'https://www.youtube.com/channel/' + channel.id" target="_blank">{{ channel.name }}</a>
                  <ul>
                    <li v-for="video in channel.videos" :key="video.id">
                      <a :href="'https://www.youtube.com/watch?v=' + video.id" target="_blank">{{ video.name || video.id }}</a>
                      <button class="btn btn-sm btn-secondary" @click="selectedArchiveId = video.id">Load archive</button>
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
                <li><a href="https://discord.gg/P6DUeuhSjU">Discord</a></li>
                <li><a href="https://github.com/RomainLK/ytc-filter" target="_blank">Github</a></li>
              </ul>
              <p>
                Please check the <a href="https://github.com/RomainLK/ytc-filter/wiki" target="_blank">wiki</a>
                for guide and help. Documentation applies to embedded ytcFilter
              </p>
              <div class="card">
                <div class="card-body">
                  <h4 class="card-title">Factory settings</h4>
                  <button class="btn btn-warning" @click="$store.commit('resetHelpAlert')">
                    Reset hint messages
                  </button>
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
        return browser.storage.local.QUOTA_BYTES
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
      if (chrome) {
        chrome.storage.local.getBytesInUse(b => (this.usedBytes = b))
      } else {
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
  },
}
</script>

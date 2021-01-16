<template>
  <div id="ytc-filter">
    <div v-if="ready">
      <div class="vc-notification" v-show="notificationMsg">
        <div class="notification-content" v-html="notificationMsg"></div>
        <button class="close sm-btn" type="button" @click="notificationMsg = ''">
          X
        </button>
      </div>
      <div class="vc-toolbar" v-show="!displayYtc">
        <button type="button" @click="ytcPopout()">
          Popout/Settings
        </button>
        <button type="button" @click="displayYtc = !displayYtc" :title="displayYtc ? 'Close ytcFilter' : 'Show ytcFilter'">{{ displayYtc ? 'X' : 'ytcFilter' }}</button>
      </div>
      <div v-show="displayYtc" class="vc-container">
        <message-list :video-id="videoId" :height="heightPx" @notify="notify" ref="messageList">
          <div>
            <button type="button" @click="ytcPopout()" style="margin-right:1rem">
              Popout/Settings
            </button>
            <button type="button" @click="displayYtc = !displayYtc" :title="displayYtc ? 'Close ytcFilter' : 'Show ytcFilter'">{{ displayYtc ? 'X' : 'ytcFilter' }}</button>
          </div>
        </message-list>
        <div class="vc-resize" v-if="!options.autoMaxHeight"><hr class="resize" @mousedown="resizing = true" /></div>
        <div v-if="showMoreCommentsDisplayed" class="vc-text-center">No new messages can be filtered when the chat isn't autoscrolling</div>
        <div v-else class="stats">
          <span title="Session statistics: filtered/total">{{ stats.filteredNb }}/{{ stats.msgNb }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ChatObserver } from '@/utils/chat-observer'
import { MoreCommentsObserver } from '@/utils/more-comments-observer'
import { getVideoId, getChannelId, getChannelName, getVideoName } from '@/utils/information-extractor'
import Vue from 'vue'
import { gtr } from 'semver'
import manifest from '@/manifest.json'
import xss from 'xss'
import { ytcMount } from '@/utils/mount'
import messageList from '@/components/message-list'
import { eventBus } from '@/utils/event-bus'
import { applyFilter } from '@/utils/apply-filter'
import { filterMigrate } from '@/utils/migrate'
import { debounce } from 'lodash'
import { storageUsageCheck } from '@/utils/storage-usage-check'

const CHANNEL_ID = getChannelId()

export default {
  components: {
    messageList,
  },
  data() {
    return {
      videoId: getVideoId(),
      observer: {},
      displayYtc: false,
      firstOpening: true,
      showMoreCommentsDisplayed: false,
      stats: {
        msgNb: 0,
        filteredNb: 0,
      },

      notificationMsg: '',
      notificationTimeOut: null,
      height: 100,
      maxHeight: 900,
      CHANNEL_ID,
      ready: false,
      resizing: false,
    }
  },
  async mounted() {
    console.log('[ytcFilter] Mounted hook start')
    storageUsageCheck(left => this.notify(`WARNING! Less than ${left}% of storage space is left in ytcFilter. Please check the Popout > Archive tab to free some space.`, 0))
    const loadButton = document.querySelector('#remount-ytc')
    if (loadButton) {
      document.removeEventListener('DOMContentLoaded', ytcMount)
      document.querySelector('.ytc-loading').remove()
    }
    await this.sendMessage('bootstrap-start')
    console.log('[ytcFilter] Bootstraping')
    this.maxHeight = document.getElementById('content-pages').getBoundingClientRect().height - 120

    this.moreCommentsObserver = new MoreCommentsObserver()
    this.moreCommentsObserver.listeners.push(e => {
      this.showMoreCommentsDisplayed = !e.attributes.disabled
    })
    await this.checkUpdate()
    if (this.$store.state.videoSettings[getVideoId()] == null) {
      console.log('[ytcFilter] No settings detected, initiating')

      this.$store.commit('initVideoSettings', {
        id: getVideoId(),
        name: getVideoName(),
        channelId: getChannelId(),
        channelName: getChannelName(),
      })
      console.log('[ytcFilter] Fetching default profiles')

      const channelDefault = this.global.defaultPerChannel[CHANNEL_ID]
      if (channelDefault) {
        await this.applyProfile(channelDefault.profileKey)
        const profileName = this.global.profiles[channelDefault.profileKey].name
        this.notify(`Default channel profile "${profileName}" was applied.`)
        console.log('[ytcFilter] Applied channel profile')
      } else if (this.global.globalDefault) {
        await this.applyProfile(this.global.globalDefault)
        const profileName = this.global.profiles[this.global.globalDefault].name
        this.notify(`Default global profile "${profileName}" was applied.`)
        console.log('[ytcFilter] Applied global profile')
      }
    } else {
      this.$store.commit('updateVideoSettings', {
        videoId: getVideoId(),
        path: 'lastViewed',
        value: new Date().toISOString(),
      })
    }

    this.displayYtc = this.options.autoOpen

    this.ready = true
    this.sendMessage('bootstrap-end')

    const commitHeight = debounce(height => {
      this.$store.commit('setVideoOptions', { videoId: getVideoId(), options: { ...this.options, height } })
    }, 300)
    document.body.addEventListener('mousemove', e => {
      if (this.resizing) {
        const messageList = this.$refs.messageList.$el
        const height = e.pageY - messageList.getBoundingClientRect().top - 50
        if (height < this.maxHeight) {
          this.height = height
          commitHeight(height)
        }
      }
    })

    this.observer = new ChatObserver()
    this.observer.observe()
    this.observer.listeners.push(this.onMessage.bind(this))
    this.observer.listeners.push(this.moveMenu.bind(this))
    document.addEventListener('chat-message-capture', e => {
      if (this.observer.listeners.length > 1) {
        console.log('[ytcFilter] Switching to fetch interceptor')
        this.observer.listeners.splice(0, 1)
      }
      this.onMessage(e.detail)
    })
    document.body.addEventListener('mouseup', e => {
      this.resizing = false
    })

    if (this.global.storageLifetime > 0) {
      const limit = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * this.global.storageLifetime)
      for (const videoSetting of Object.values(this.$store.state.videoSettings)) {
        if (new Date(videoSetting.lastViewed) < limit) {
          this.$store.commit('removeVideoSettings', videoSetting.id)
          console.log('[ytcFilter] Archive cleaning:', videoSetting.id, videoSetting.lastViewed)
        }
      }
    }

    console.log('[ytcFilter] Mounted hook end')
  },
  beforeDestroy() {
    this.observer.clear()
  },
  computed: {
    valueLabel() {
      switch (this.filterType) {
        case 'msgIncludes':
          return 'Message includes:'
        case 'author':
          return 'Author is:'
        default:
          return 'Filter value:'
      }
    },
    filterHasValue() {
      return ['author', 'msgIncludes', 'regex'].includes(this.filterType)
    },
    filterHasCaseSensitive() {
      return ['author', 'msgIncludes'].includes(this.filterType)
    },
    finalHeight() {
      if (this.options.autoMaxHeight) {
        return Number(this.maxHeight)
      }
      return Number(this.height)
    },
    heightPx() {
      return this.finalHeight + 'px'
    },
    profileDefaultChannel() {
      if (this.editingProfileKey) {
        return Object.values(this.global.defaultPerChannel).filter(info => info.profileKey === this.editingProfileKey)
      }
      return []
    },
    videoSettings() {
      return this.$store.state.videoSettings[getVideoId()]
    },
    filters() {
      return this.videoSettings.feeds.default.filters
    },
    options() {
      return this.videoSettings?.options || {}
    },
    global() {
      return this.$store.getters.global
    },
  },
  watch: {
    displayYtc() {
      if (this.firstOpening) {
        eventBus.$emit('first-opening')
        this.firstOpening = false
      }
    },
    'options.height'(value) {
      this.height = value
    },
  },
  methods: {
    async checkUpdate(force = false) {
      const lastVersion = this.$store.state.global.version || '0.0.0'
      console.log('[ytcFilter] Last version detected:', lastVersion)
      if (gtr(manifest.version, lastVersion)) {
        console.log('[ytcFilter] Current version:', manifest.version)
        //Migration from 1.5.0 to 1.6.1 for default profile
        if (this.global && this.global.profiles.default && this.global.profiles.default.name == null && this.global.globalDefault == null) {
          console.log('[ytcFilter] Migrate to 1.6.1')
          this.global.profiles.default.name = 'Default'
          this.global.globalDefault = 'default'
        }
        if (this.$store.state.global.version == null) {
          //Migration to 2.0.0
          console.log('[ytcFilter] Migrate to 2.0.0')

          const handleStorage = storage => {
            console.log('[ytcFilter] Migrating storage', storage)

            //Video settings
            for (const key of Object.keys(storage)) {
              if (key.startsWith('cache:vcVideo')) {
                // const id = key.slice(13)
                // const parsed = JSON.parse(value.data)
                // parsed.id = id
                // parsed.feeds = {
                //   default: {
                //     messages: parsed.messages,
                //     deduplication: parsed.deduplication,
                //     filters: parsed.filters.map(filterMigrate),
                //   },
                // }
                // delete parsed.messages
                // delete parsed.deduplication
                // delete parsed.filters
                // console.log('[ytcFilter]Migrating video', key, parsed)
                // this.$store.commit('addVideoSettings', parsed)
                if (chrome) {
                  chrome.storage.local.remove(key)
                } else {
                  browser.storage.local.remove(key)
                }
              }
            }
            let global = {}
            try {
              global = storage['cache:vcGlobal']?.data ? JSON.parse(storage['cache:vcGlobal'].data) : {}
            } catch (e) {
              console.warning('[ytcFilter] Error retrieving/parsing old global', e)
            }
            if (global.profiles) {
              for (const [key, profile] of Object.entries(global.profiles)) {
                Vue.set(profile, 'key', key)
              }
            }

            const newGlobal = {
              ...global,
              version: '2.0.0',
              darkMode: false,
              fullPopout: {
                height: 800,
                width: 1200,
              },
              compactPopout: {
                height: 600,
                width: 400,
              },
            }
            console.log('[ytcFilter] New global', newGlobal)
            this.$store.commit('setGlobal', newGlobal)

            if (chrome) {
              chrome.storage.local.remove('cache:vcGlobal')
            } else {
              browser.storage.local.remove('cache:vcGlobal')
            }
          }
          if (chrome) {
            await new Promise(resolve => {
              chrome.storage.local.get(s => {
                handleStorage(s)
                resolve()
              })
            })
          } else {
            const storage = await browser.storage.get()
            handleStorage(storage)
          }
          console.log('[ytcFilter] End migrate to 2.0.0')
        }

        if (gtr('2.0.1', lastVersion)) {
          console.log('[ytcFilter] Migrate to 2.0.1. Global:', this.$store.getters.global)
          //Unborking 2.0.0 migration and fresh install
          const global = this.$store.getters.global
          if (global.profiles) {
            for (const profile of Object.values(global.profiles)) {
              profile.filters = profile.filters.map(filterMigrate)
            }
          } else {
            global.profiles = {}
          }

          const newGlobal = { ...global, profiles: global.profiles }
          if (!newGlobal.defaultPerChannel) {
            newGlobal.defaultPerChannel = Vue.observable({})
          }
          if (newGlobal.globalDefault === undefined) {
            newGlobal.globalDefault = null
          }
          this.$store.commit('setGlobal', newGlobal)
        }
        if (gtr('2.1.0', lastVersion)) {
          const newGlobal = { ...this.$store.getters.global, limitMsgPerVideo: 100, storageLifetime: 7 }
          this.$store.commit('setGlobal', newGlobal)
          for (const videoSettings of Object.values(this.$store.state.videoSettings)) {
            const newVideoSettings = { ...videoSettings, lastViewed: new Date().toISOString() }
            this.$store.commit('addVideoSettings', newVideoSettings)
          }
        }
        this.$store.commit('setGlobal', { ...this.$store.getters.global, version: manifest.version })
        this.$store.commit('setHelpAlert', { key: 'welcome', value: true })
        console.log('[ytcFilter] Migration ended.', this.$store.state)
        this.notifyChangelog()
      }
    },
    notifyChangelog() {
      this.notify(
        `
      Welcome to ytcFilter ${manifest.version}. In order to start, please check the "Popout/Settings". Help information and changelog are in the help tab.
      `,
        0
      )
    },
    async onMessage(msg) {
      this.stats.msgNb++
      // if (this.global.authorBlacklist[msg.author]) {
      //   return
      // }
      for (const filter of this.filters) {
        if (applyFilter(filter, msg)) {
          this.addMessage(msg)
          await new Promise(resolve => setTimeout(resolve, 500))
          // const menu = document.getElementById(msg.id).querySelector('#menu-button')
          // if (menu != null) {
          //   document
          //     .getElementById(`ytc${msg.id}`)
          //     .querySelector('.yt-menu-append')
          //     .append(menu)
          // }
        }
      }
    },
    async moveMenu(msg) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const menu = document.getElementById(msg.id).querySelector('#menu-button')
      const ytcMsg = document.getElementById(`ytc${msg.id}`)
      if (menu != null && ytcMsg != null) {
        ytcMsg.querySelector('.yt-menu-append').append(menu)
      }
    },
    async addMessage(msg) {
      this.stats.filteredNb++
      msg.html = xss(msg.html, { stripIgnoreTag: true })
      this.$store.commit('addMessage', {
        videoId: getVideoId(),
        feedName: 'default',
        message: msg,
      })
    },
    saveGlobal() {
      this.$store.commit('setGlobal', this.global)
    },

    async applyProfile(key) {
      try {
        const { profiles } = this.global
        if (profiles?.[key]) {
          this.$store.commit('applyProfile', { videoId: getVideoId(), feedName: 'default', profileKey: key })
          return true
        } else {
          return false
        }
      } catch (e) {
        console.warn('applyProfile - Failed to apply preset')
        console.error(e)
        return false
      }
    },

    saveConfig() {
      this.$store.commit('addVideoSettings', {
        id: getVideoId(),
        name: getVideoName(),
        channelId: getChannelId(),
        channelName: getChannelName(),
        options: this.options,
        lastViewTimestamp: new Date(),
        feeds: {
          default: {
            messages: this.messages,
            filters: this.filters,
            options: this.options,
            deduplication: {},
          },
        },
      })
    },

    notify(msg, timeout = 5000) {
      if (this.notificationTimeOut) {
        clearTimeout(this.notificationTimeOut)
        this.notificationTimeOut = ''
      }
      this.notificationMsg = msg
      if (timeout > 0) {
        this.notificationTimeOut = setTimeout(() => {
          this.notificationMsg = ''
          this.notificationTimeOut = null
        }, timeout)
      }
    },

    sendMessage(action, payload) {
      return new Promise(resolve => chrome.runtime.sendMessage({ action, payload }, resolve))
    },
    ytcPopout() {
      const hasFilters = this.filters.length > 0
      const size = hasFilters ? this.$store.getters.compactPopoutSize : this.$store.getters.fullePopoutSize
      this.sendMessage('popout', {
        videoId: getVideoId(),
        channelId: getChannelId(),
        channelName: getChannelName(),
        videoName: getVideoName(),
        ...size,
      })
    },
  },
}
</script>

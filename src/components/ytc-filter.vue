<template>
  <div id="ytc-filter">
    <div class="vc-notification" v-show="notificationMsg">
      <div class="notification-content" v-html="notificationMsg"></div>
      <button class="close sm-btn" type="button" @click="notificationMsg = ''">
        X
      </button>
    </div>
    <div class="vc-toolbar">
      <div :class="{ hidden: !displayYtc }" class="vc-valign">
        <button type="button" class="sm-btn" title="Go to bottom" @click="goToBottom">
          <svg class="svg-icon" viewBox="0 0 20 20" width="18" height="18">
            <path
              d="M13.962,8.885l-3.736,3.739c-0.086,0.086-0.201,0.13-0.314,0.13S9.686,12.71,9.6,12.624l-3.562-3.56C5.863,8.892,5.863,8.611,6.036,8.438c0.175-0.173,0.454-0.173,0.626,0l3.25,3.247l3.426-3.424c0.173-0.172,0.451-0.172,0.624,0C14.137,8.434,14.137,8.712,13.962,8.885 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.148,17.521,17.521,14.147,17.521,10"
            ></path>
          </svg>
        </button>
        <button type="button" class="sm-btn" title="Go to top" @click="goToTop">
          <svg class="svg-icon" viewBox="0 0 20 20" width="18" height="18">
            <path
              d="M13.889,11.611c-0.17,0.17-0.443,0.17-0.612,0l-3.189-3.187l-3.363,3.36c-0.171,0.171-0.441,0.171-0.612,0c-0.172-0.169-0.172-0.443,0-0.611l3.667-3.669c0.17-0.17,0.445-0.172,0.614,0l3.496,3.493C14.058,11.167,14.061,11.443,13.889,11.611 M18.25,10c0,4.558-3.693,8.25-8.25,8.25c-4.557,0-8.25-3.692-8.25-8.25c0-4.557,3.693-8.25,8.25-8.25C14.557,1.75,18.25,5.443,18.25,10 M17.383,10c0-4.07-3.312-7.382-7.383-7.382S2.618,5.93,2.618,10S5.93,17.381,10,17.381S17.383,14.07,17.383,10"
            ></path>
          </svg>
        </button>
        <button type="button" @click="displayFilters = !displayFilters">{{ displayFilters ? 'Hide filters' : 'Show filters' }}</button>
      </div>
      <div :class="{ hidden: !displayYtc }">
        <button type="button" @click="displayOptions = !displayOptions">{{ displayOptions ? 'Hide options' : 'Show options' }}</button>
      </div>
      <div>
        <button type="button" @click="displayYtc = !displayYtc">{{ displayYtc ? 'X' : 'ytcFilter' }}</button>
      </div>
    </div>
    <div v-show="displayYtc" class="vc-container">
      <!--Filters-->
      <div v-show="displayFilters" class="vc-options">
        <form>
          <div class="vc-options-item">
            <label for="filter-type">Type:</label>
            <select id="filter-type" v-model="filterType">
              <option value="msgIncludes">Text includes</option>
              <option value="author">Author is</option>
              <option value="isModerator">Is moderator</option>
              <option value="isOwner">Is owner</option>
              <option value="regex">Regex</option>
            </select>
          </div>
          <div class="vc-options-item">
            <label for="filter-value">Value:</label>
            <input id="filter-value" type="text" v-model="filterInput" :disabled="!filterHasValue" />
          </div>
          <div class="vc-options-item flex-align-center">
            <label for="filter">Case sensitive:</label>
            <input id="case-sensitive" type="checkbox" v-model="caseSensitive" :disabled="!filterHasCaseSensitive" />
            <button type="submit" @click.prevent="addFilter">Add</button>
          </div>
        </form>
        <div class="vc-options-item">
          <div class="vc-title">Current filter:</div>
          <ul class="vc-filter-list">
            <li class="vc-filter-item" v-for="(filter, index) in filters" :key="'f' + index">
              <span v-if="!filter.regex && filter.caseSensitive">(Case sensitive)</span>
              <span v-if="filter.author">Author: {{ filter.author }}</span>
              <span v-else-if="filter.msgIncludes">Text includes: {{ filter.msgIncludes }}</span>
              <span v-else-if="filter.regex">Regex: {{ filter.regex }}</span>
              <span v-else-if="filter.isModerator">Is moderator</span>
              <span v-else-if="filter.isOwner">Is owner</span>
              <button type="button" class="sm-btn" @click="removeFilter(filter)">X</button>
            </li>
          </ul>
        </div>
      </div>
      <!--Options-->
      <div v-show="displayOptions" class="vc-options">
        <div class="vc-options-item">
          <div class="vc-title">Chat:</div>
          <label for="auto-open-opt" class="flex-align-center">
            Auto open:
            <input id="auto-open-opt" type="checkbox" v-model="options.autoOpen" />
          </label>
          <label for="auto-scroll-opt" class="flex-align-center">
            Auto scroll:
            <input id="auto-scroll-opt" type="checkbox" v-model="options.autoScroll" />
          </label>
          <label for="height-opt" class="flex-align-center"> Height: <input type="range" id="height-opt" min="50" max="400" v-model="options.height" step="1" /> </label>
        </div>
        <div class="vc-options-item">
          <button type="button" @click="clearMessages">Clear filtered chat</button>
        </div>
        <div class="vc-options-item">
          <div class="vc-title">Default profile:</div>
          <button type="button" @click="saveProfile('default')">Save</button>
          <button type="button" @click="removeProfile('default')">Remove</button>
          <button type="button" @click="restoreProfileClick('default')">Apply</button>
        </div>
        <div class="vc-options-item">
          In order for ytcFilter to work, your Livechat should be autoscrolling and timestamps should be displayed <button type="button" @click="notifyChangelog">Changelog</button>
        </div>
      </div>
      <!--Content-->
      <div class="vc-content" :style="{ height: heightPx }" ref="content">
        <div class="vc-message-item" v-for="msg in messages" :key="msg.timestamp + msg.author + msg.message">
          <span class="vc-timestamp">{{ msg.timestamp }}</span>
          <span class="vc-author" :class="{ author: msg.authorType === 'moderator', owner: msg.authorType === 'owner' }">
            {{ msg.author
            }}<svg v-if="msg.authorType === 'moderator'" class="author-icon" viewBox="0 0 16 16" preserveAspectRatio="xMidYMid meet" focusable="false" width="16" height="16">
              <g>
                <path
                  d="M9.64589146,7.05569719 C9.83346524,6.562372 9.93617022,6.02722257 9.93617022,5.46808511 C9.93617022,3.00042984 7.93574038,1 5.46808511,1 C4.90894765,1 4.37379823,1.10270499 3.88047304,1.29027875 L6.95744681,4.36725249 L4.36725255,6.95744681 L1.29027875,3.88047305 C1.10270498,4.37379824 1,4.90894766 1,5.46808511 C1,7.93574038 3.00042984,9.93617022 5.46808511,9.93617022 C6.02722256,9.93617022 6.56237198,9.83346524 7.05569716,9.64589147 L12.4098057,15 L15,12.4098057 L9.64589146,7.05569719 Z"
                ></path>
              </g></svg
          ></span>
          <span class="vc-message" v-html="msg.html"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ChatObserver } from '@/utils/chat-observer'
import { getVideoId } from '@/utils/information-extractor'
import cache from 'webext-storage-cache'
import { sha1 } from 'crypto-hash'
import RegexParser from 'regex-parser'
import Vue from 'vue'
import { gtr } from 'semver'
import manifest from '@/manifest.json'
import changelog from '@/../changelog.md'
import xss from 'xss'

const MAX_AGE = { days: 9999 }
const VIDEO_STORAGE_KEY = `vcVideo${getVideoId()}`
const GLOBAL_STORAGE_KEY = 'vcGlobal'
const VERSION_STORAGE_KEY = 'vcVersion'

let deduplicationMap = {}

const regexCache = new WeakMap()

export default {
  data() {
    return {
      observer: {},
      displayYtc: false,
      displayFilters: false,
      displayOptions: false,
      caseSensitive: false,
      filterInput: '',
      messages: [],
      filters: [],
      filterType: 'msgIncludes',
      firstOpening: true,
      options: {
        autoOpen: false,
        autoScroll: true,
        height: 100,
      },
      global: {
        profiles: {},
      },
      notificationMsg: '',
      notificationTimeOut: null,
    }
  },
  async mounted() {
    this.observer = new ChatObserver()
    this.observer.observe()
    this.observer.listeners.push(this.onMessage.bind(this))
    await this.loadGlobal()
    if (!(await this.loadConfig())) {
      if (await this.restoreProfile('default')) {
        this.notify('Default profile was applied')
      }
    }
    if (this.filters.length === 0) {
      this.displayFilters = true
    }
    this.displayYtc = this.options.autoOpen
    this.checkUpdate()
  },
  beforeDestroy() {
    this.observer.clear()
  },
  computed: {
    filterHasValue() {
      return ['author', 'msgIncludes', 'regex'].includes(this.filterType)
    },
    filterHasCaseSensitive() {
      return ['author', 'msgIncludes'].includes(this.filterType)
    },
    heightPx() {
      return this.options.height + 'px'
    },
  },
  watch: {
    options: {
      handler: 'saveConfig',
      deep: true,
    },
    displayYtc() {
      if (this.options.autoScroll && this.firstOpening) {
        this.goToBottom()
        this.firstOpening = false
      }
    },
  },
  methods: {
    async checkUpdate(force = false) {
      let lastVersion = '0.0.0'
      if (await cache.has(VERSION_STORAGE_KEY)) {
        lastVersion = await cache.has(VERSION_STORAGE_KEY)
      }
      if (gtr(manifest.version, lastVersion)) {
        this.notifyChangelog()
        cache.set(VERSION_STORAGE_KEY, manifest.version, MAX_AGE)
      }
    },
    notifyChangelog() {
      this.notify(changelog, 0)
    },
    addFilter() {
      if (this.filterHasValue && !this.filterInput) {
        this.notify('This filter requires a value')
        return
      }
      this.filters.push({ [this.filterType]: this.filterInput || true, caseSensitive: this.caseSensitive })
      this.filterInput = ''
      this.saveConfig()
    },
    onMessage(msg) {
      for (const filter of this.filters) {
        if (filter.msgIncludes) {
          const caseSensitive = filter.caseSensitive && msg.message.includes(filter.msgIncludes)
          const caseInsensitive = !filter.caseSensitive && msg.message.toLowerCase().includes(filter.msgIncludes.toLowerCase())
          if (caseSensitive || caseInsensitive) {
            this.addMessage(msg)
          }
        } else if (filter.author) {
          const caseSensitive = filter.caseSensitive && msg.author === filter.author
          const caseInsensitive = !filter.caseSensitive && msg.author.toLowerCase() === filter.author.toLowerCase()
          if (caseSensitive || caseInsensitive) {
            this.addMessage(msg)
          }
        } else if (filter.isModerator && msg.authorType === 'moderator') {
          this.addMessage(msg)
        } else if (filter.isOwner && msg.authorType === 'owner') {
          this.addMessage(msg)
        } else if (filter.regex) {
          let regex = regexCache.get(filter)
          if (!regex) {
            regex = RegexParser(filter.regex)
            regexCache.set(filter, regex)
          }
          if (regex.test(msg.message)) {
            this.addMessage(msg)
          }
        }
      }
    },
    async addMessage(msg) {
      const hash = await sha1(msg.timestamp + msg.author + msg.message)
      if (!deduplicationMap[hash]) {
        deduplicationMap[hash] = true
      } else {
        return
      }
      msg.html = xss(msg.html)
      const isAtBottom = this.$refs.content.scrollTop + this.$refs.content.clientHeight >= this.$refs.content.scrollHeight - 50

      this.messages.push(msg)

      if (this.options.autoScroll && isAtBottom) {
        await this.goToBottom()
      }
      this.saveConfig()
    },

    goToTop() {
      this.$refs.content.scrollTop = 0
    },

    async goToBottom() {
      await this.$nextTick()
      this.$refs.content.scrollTop = this.$refs.content.scrollHeight
    },

    removeFilter(filter) {
      const index = this.filters.indexOf(filter)
      if (index !== -1) {
        this.filters.splice(index, 1)
      }
      this.saveConfig()
    },

    clearMessages() {
      this.messages = []
      deduplicationMap = {}
      this.saveConfig()
    },

    async saveProfile(name) {
      if (!name) {
        console.warn('saveProfile - Missing profile name')
        return
      }
      const profile = Vue.observable({
        filters: [...this.filters],
        options: {
          ...this.options,
        },
      })
      this.$set(this.global.profiles, name, profile)
      await this.saveGlobal()
      this.notify(`Profile "${name}" was saved`)
    },
    async removeProfile(name) {
      if (!this.global.profiles[name]) {
        this.notify(`Profile "${name}" doesn't exist`)
        return
      }
      delete this.global.profiles[name]
      this.notify(`Profile "${name}" was removed`)
      await this.saveGlobal()
    },
    saveGlobal() {
      return cache.set(GLOBAL_STORAGE_KEY, JSON.stringify(this.global), MAX_AGE)
    },

    async loadGlobal() {
      const hasGlobal = await cache.has(GLOBAL_STORAGE_KEY)
      if (!hasGlobal) {
        return false
      }
      try {
        this.global = JSON.parse(await cache.get(GLOBAL_STORAGE_KEY))
      } catch (e) {
        console.warn('restoreProfile - Failed to load global')
        return false
      }
    },

    async restoreProfileClick(name) {
      if (!(await this.restoreProfile(name))) {
        this.notify(`Profile "${name}" doesn't exist`)
      }
    },

    async restoreProfile(name) {
      if (!name) {
        console.warn('restoreProfile - Missing profile name')
        return false
      }
      try {
        const { profiles } = this.global
        if (profiles?.[name]) {
          this.setConfig(profiles[name])
          return true
        } else {
          return false
        }
      } catch (e) {
        console.warn('restoreProfile - Failed to load global')
        return false
      }
    },

    async saveConfig() {
      await cache.set(
        VIDEO_STORAGE_KEY,
        JSON.stringify({
          messages: this.messages,
          filters: this.filters,
          options: this.options,
          deduplication: deduplicationMap,
        }),
        MAX_AGE
      )
    },

    async loadConfig() {
      const hasConfig = await cache.has(VIDEO_STORAGE_KEY)
      if (!hasConfig) {
        return false
      }
      const config = await cache.get(VIDEO_STORAGE_KEY)
      try {
        this.setConfig(JSON.parse(config))
      } catch (e) {
        console.warn('loadConfig - Failed to load config', e)
        return false
      }
      return true
    },

    setConfig({ messages, filters, deduplication, options } = {}) {
      if (messages && deduplication) {
        this.messages = messages
        deduplicationMap = deduplication
      }
      if (filters) {
        this.filters = filters
      }
      if (options) {
        Object.assign(this.options, options)
      }
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
  },
}
</script>

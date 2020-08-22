<template>
  <div id="vchatter">
    <div class="vc-toolbar">
      <button
        type="button"
        @click="displayVchatter = !displayVchatter"
      >{{ displayVchatter ? 'Hide VChatter' : 'Show VChatter' }}</button>
      <div v-show="displayVchatter">
        <button
          type="button"
          @click="displayFilters = !displayFilters"
        >{{ displayFilters ? 'Hide filters' : 'Show filters' }}</button>
      </div>
      <div v-show="displayVchatter">
        <button
          type="button"
          @click="displayOptions = !displayOptions"
        >{{ displayOptions ? 'Hide options' : 'Show options' }}</button>
      </div>
    </div>
    <div v-show="displayVchatter" class="vc-container">
      <div v-show="displayFilters" class="vc-options">
        <form>
          <div class="vc-options-item">
            <label for="filter-type">Type:</label>
            <select id="filter-type" v-model="filterType">
              <option value="author">Author is</option>
              <option value="msgIncludes">Text includes</option>
              <option value="regex">Regex</option>
            </select>
          </div>
          <div class="vc-options-item">
            <label for="filter-value">Value:</label>
            <input id="filter-value" type="text" v-model="filterInput" />
          </div>
          <div class="vc-options-item">
            <label for="filter">Case sensitive:</label>
            <input
              id="case-sensitive"
              type="checkbox"
              v-model="caseSensitive"
              :disabled="filterType === 'regex'"
            />
            <button type="submit" @click.prevent="addFilter">Add</button>
          </div>
        </form>
        <div class="vc-title">Current filter:</div>
        <ul class="vc-filter-list">
          <li class="vc-filter-item" v-for="(filter, index) in filters" :key="'f'+index">
            <span v-if="!filter.regex && filter.caseSensitive">(Case sensitive)</span>
            <span v-if="filter.author">Author: {{filter.author}}</span>
            <span v-else-if="filter.msgIncludes">Text includes: {{filter.msgIncludes}}</span>
            <span v-else-if="filter.regex">Regex: {{filter.regex}}</span>
            <button @click="removeFilter(filter)">X</button>
          </li>
        </ul>
      </div>
      <div v-show="displayOptions" class="vc-options">
        <div class="vc-options-item">
          <label for="autoscroll-opts">
            Autoscroll:
            <input id="autoscroll-opts" type="checkbox" v-model="options.autoScroll" />
          </label>
        </div>
        <div class="vc-options-item">
          <button type="button" @click="clearMessages">Clear filtered chat</button>
        </div>
        <div
          class="vc-options-item"
        >In order for VChatter to work, your Livechat should be autoscrolling
         and timestamps should be displayed</div>
      </div>
      <div class="vc-content" ref="content">
        <div
          class="vc-message-item"
          v-for="msg in messages"
          :key="msg.timestamp +  msg.author + msg.message"
        >
          <span class="vc-timestamp">{{msg.timestamp}}</span>
          <span class="vc-author">{{msg.author}}</span>
          <span class="vc-message">{{msg.message}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { browser } from 'webextension-polyfill'
import { ChatObserver } from '@/utils/chat-observer'
import { getVideoId, getChannelId } from '@/utils/information-extractor'
import Vue from 'vue'
import cache from 'webext-storage-cache'
import { sha1 } from 'crypto-hash'
import RegexParser from 'regex-parser'

const MAX_AGE = { days: 9999 }
const VIDEO_STORAGE_KEY = `vcVideo${getVideoId()}`
const CHANNEL_STORAGE_KEY = `vcVideo${getVideoId()}`
let deduplication = {}

const regexCache = new WeakMap()

export default {
  data() {
    return {
      observer: {},
      displayVchatter: false,
      displayFilters: false,
      displayOptions: false,
      caseSensitive: false,
      filterInput: '',
      messages: [],
      filters: [],
      filterType: 'author',
      options: {
        autoScroll: true,
      },
    }
  },
  async mounted() {
    this.observer = new ChatObserver()
    this.observer.observe()
    this.observer.listeners.push(this.onMessage.bind(this))
    await this.restoreConfig()
    if (this.filters.length === 0) {
      this.displayFilters = true
    }
  },
  beforeDestroy() {
    this.observer?.clear()
  },
  watch: {
    options: {
      handler: 'saveConfig',
      deep: true,
    },
  },
  methods: {
    addFilter() {
      if (this.filterInput) {
        this.filters.push({ [this.filterType]: this.filterInput, caseSensitive: this.caseSensitive })
        this.filterInput = ''
        this.saveConfig()
      }
    },
    onMessage(msg) {
      for (const filter of this.filters) {
        if (filter.author) {
          const caseSensitive = filter.caseSensitive && msg.author === filter.author
          const caseInsensitive = !filter.caseSensitive && msg.author.toLowerCase() === filter.author.toLowerCase()
          if (caseSensitive || caseInsensitive) {
            this.addMessage(msg)
          }
        } else if (filter.msgIncludes) {
          const caseSensitive = filter.caseSensitive && msg.message.includes(filter.msgIncludes)
          const caseInsensitive = !filter.caseSensitive && msg.message.toLowerCase().includes(filter.msgIncludes.toLowerCase())
          if (caseSensitive || caseInsensitive) {
            this.addMessage(msg)
          }
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
      if (!deduplication[hash]) {
        deduplication[hash] = true
      } else {
        return
      }
      this.messages.push(msg)

      if (this.options.autoScroll) {
        await this.$nextTick()
        this.$refs.content.scrollTop = this.$refs.content.scrollHeight
      }
      this.saveConfig()
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
      deduplication = {}
      this.saveConfig()
    },

    async saveConfig() {
      await Promise.all([
        cache.set(
          VIDEO_STORAGE_KEY,
          JSON.stringify({
            messages: this.messages,
            filters: this.filters,
            options: this.options,
            deduplication,
          }),
          MAX_AGE
        ),
        /* cache.set(CHANNEL_STORAGE_KEY, {
          filters: this.filters,
        }, MAX_AGE),*/
      ])
    },
    async restoreConfig() {
      const hasConfig = await cache.has(VIDEO_STORAGE_KEY)
      if (hasConfig) {
        const config = await cache.get(VIDEO_STORAGE_KEY)
        try {
          const { messages, filters, deduplication: storedDedup, options } = JSON.parse(config)
          this.messages = messages
          this.filters = filters
          this.options = options || { autoSroll: true }
          deduplication = storedDedup
        } catch (e) {
          console.warn('Failed to load config')
        }
      }
    },
  },
}
</script>
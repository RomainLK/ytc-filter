<template>
  <div id="vchatter">
    <div class="vc-toolbar">
      <button
        type="button"
        @click="displayVchatter = !displayVchatter"
      >{{ displayVchatter ? 'Hide Vchatter' : 'Show Vchatter' }}</button>
      <div v-show="displayVchatter">
        <button
          type="button"
          @click="displayFilters = !displayFilters"
        >{{ displayFilters ? 'Hide filters' : 'Show filters' }}</button>
      </div>
      <div v-show="displayVchatter">
        <button type="button" @click="displayOptions = !displayOptions">{{ displayOptions ? 'Hide options' : 'Show options' }}</button>
      </div>
    </div>
    <div v-show="displayVchatter" class="vc-container">
      <div v-show="displayFilters" class="vc-options">
        <form>
          <label for="nickname-filter">Nickname filter</label>
          <input id="nickname-filter" type="text" v-model="nicknameFilter" />
          <button type="submit" @click.prevent="addNickname">Add</button>
        </form>
        <div class="vc-title">Current filter:</div>
        <ul>
          <li class="vc-filter-item" v-for="(filter, index) in filters" :key="'f'+index">
            {{ filter.author ? 'Author:' : 'Regex'}} {{ filter.author || filter.regex }}
            <button @click="removeFilter(filter)">X</button>
          </li>
        </ul>
      </div>
       <div v-show="displayOptions" class="vc-options">
         <button type="button"  @click="clearMessages">Clear filtered chat</button>
       </div>
      <div class="vc-content">
        <div class="vc-message-item" v-for="msg in messages" :key="msg.message">
          <span class="vc-timestamp">{{msg.timestamp}}</span>
          <span class="vc-author">{{msg.author}}</span>
          <span class="vc-message">{{msg.message}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ChatObserver } from '@/utils/chat-observer'
import { getVideoId, getChannelId } from '@/utils/information-extractor'
import Vue from 'vue'
import cache from 'webext-storage-cache'
import { sha1 } from 'crypto-hash'

const MAX_AGE = { days: 9999 }
const VIDEO_STORAGE_KEY = `vcVideo${getVideoId()}`
const CHANNEL_STORAGE_KEY = `vcVideo${getVideoId()}`
let deduplication = {}

export default {
  data() {
    return {
      observer: {},
      displayVchatter: false,
      displayFilters: false,
      displayOptions: false,
      nicknameFilter: '',
      messages: [],
      filters: [],
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
  methods: {
    addNickname() {
      if (this.nicknameFilter) {
        this.filters.push({ author: this.nicknameFilter })
        this.nicknameFilter = ''
        this.saveConfig()
      }
    },
    onMessage(msg) {
      for (const filter of this.filters) {
        if (filter.author === msg.author) {
          console.log('AUTH', deduplication)
          this.addMessage(msg)
        }
      }
    },
    async addMessage(msg) {
      const hash = await sha1(msg.author + msg.message)
      if (!deduplication[hash]) {
        deduplication[hash] = true
      } else {
        return
      }
      this.messages.push(msg)
      this.saveConfig()
    },

    removeFilter(filter){
      const index = this.filters.indexOf(filter)
      if(index !== -1) {
        this.filters.splice(index, 1);
      }
    },

    clearMessages(){
      this.messages=[];
      deduplication= {};
      this.saveConfig();
    },

    async saveConfig() {
      await Promise.all([
        cache.set(
          VIDEO_STORAGE_KEY,
          {
            messages: this.messages,
            filters: this.filters,
            deduplication,
          },
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
        const { messages, filters, deduplication: storedDedup } = await cache.get(VIDEO_STORAGE_KEY)
        this.messages = messages
        this.filters = filters
        deduplication = storedDedup
      }
    },
  },
}
</script>
<style lang="scss">
</style>
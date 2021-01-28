import Vue from 'vue'
import Vuex from 'vuex'
import VuexWebExtensions from '@/lib/vuex-webextensions'
import { set, cloneDeep } from 'lodash'

Vue.use(Vuex)

const options = {
  autoOpen: false,
  autoScroll: true,
  height: 100,
  autoMaxHeight: false,
}

const defaultProfiles = {
  staff: { name: 'Messages from staff', key: 'staff', filters: [{ type: 'isModerator' }, { type: 'isOwner' }], options: { ...options } },
  englishtag: {
    name: 'English tagged messages',
    key: 'englishtag',
    // eslint-disable-next-line
    filters: [{ type: 'regex', value: `/^[[(]?(?:eng?|t(?:(rans|l))+|英訳)(?:\/(?:eng?|t(?:(rans|l))?|英訳))?[\\]): -]/i` }],
    // /^[[(]?(?:eng?|t(?:(rans|l))+|英訳)(?:\/(?:eng?|t(?:(rans|l))?|英訳))?[\\]): -]/i
    options: { ...options },
  },
  alphanumeric: { name: 'Messages with alphanumeric', key: 'alphanumeric', filters: [{ type: 'regex', value: '/[a-z0-9]+/i' }], options: { ...options } },
  japanese: {
    name: '日本語/Messages with japanese characters',
    key: 'japanese',
    filters: [{ type: 'regex', value: '/[一-龠]|[ぁ-ゔ]|[ァ-ヴー]|[ａ-ｚＡ-Ｚ０-９]|[々〆〤]/u' }],
    options: { ...options },
  },
}

export default new Vuex.Store({
  state: {
    videoSettings: {},
    global: {
      darkMode: false,
      version: null,
      profiles: {},
      defaultPerChannel: {},
      globalDefault: null,
      fullPopout: {
        height: null,
        width: null,
      },
      compactPopout: {
        height: null,
        width: null,
      },
      limitMsgPerVideo: 100,
      storageLifetime: 7,
    },
    helpAlert: {
      filterHelp: true,
      profileHelp: true,
      profileDefaultHelp: true,
      welcome: true,
    },
    //authorBlacklist: {},
  },
  getters: {
    global(state) {
      return state.global
    },
    profiles(state) {
      return state.global.profiles
    },
    compactPopoutSize(state) {
      return { width: state.global?.compactPopout?.width, height: state.global?.compactPopout.height }
    },
    fullPopoutSize(state) {
      return { width: state.global?.fullPopout.width, height: state.global?.fullPopout.height }
    },
    channelArchive(state) {
      const archive = { _missing: { id: '_missing', name: 'No channel name', videos: [] } }
      for (const videoSettings of Object.values(state.videoSettings)) {
        try {
          if (videoSettings.feeds.default.messages.length > 0) {
            if (videoSettings.channelId) {
              if (archive[videoSettings.channelId] == null) {
                archive[videoSettings.channelId] = { id: videoSettings.channelId, name: videoSettings.channelName, videos: [] }
              }
              archive[videoSettings.channelId].videos.push(videoSettings)
            } else {
              archive._missing.videos.push(videoSettings)
            }
          }
        } catch (e) {
          console.error('[ytcFilter] Issue in channelArchive getter:', e)
        }
      }

      return Object.values(archive)
        .filter(c => c.videos.length > 0)
        .sort((a, b) => {
          const nameA = a.name.toUpperCase() // ignore upper and lowercase
          const nameB = b.name.toUpperCase() // ignore upper and lowercase
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }

          // names must be equal
          return 0
        })
    },
  },
  /**
   * Be careful with the data sent, as the reference will change when synchronising between different context.
   */
  mutations: {
    factoryReset(state) {
      state.videoSettings = {}
      state.global = {
        darkMode: false,
        version: null,
        profiles: {},
        defaultPerChannel: {},
        globalDefault: null,
        fullPopout: {
          height: null,
          width: null,
        },
        compactPopout: {
          height: null,
          width: null,
        },
        limitMsgPerVideo: 100,
        storageLifetime: 7,
      }
      state.helpAlert = {
        filterHelp: true,
        profileHelp: true,
        profileDefaultHelp: true,
        welcome: false,
      }
    },
    setFullPopoutSize(state, { height, width }) {
      if (height) {
        state.global.fullPopout.height = height
      }
      if (width) {
        state.global.fullPopout.width = width
      }
    },
    setCompactPopoutSize(state, { height, width }) {
      if (height) {
        state.global.compactPopout.height = height
      }
      if (width) {
        state.global.compactPopout.width = width
      }
    },
    toggleDarkMode(state) {
      state.global.darkMode = !state.global.darkMode
    },
    setGlobal(state, value) {
      state.global = value
    },
    updateGlobal(state, { value, path }) {
      set(state.global, path, value)
    },
    addProfile(state, profile) {
      state.global.profiles = { ...state.global.profiles, [profile.key]: profile }
    },
    loadDefaultProfile(state) {
      state.global.profiles = { ...state.global.profiles, ...cloneDeep(defaultProfiles) }
    },
    initVideoSettings(state, { id, name, channelId, channelName }) {
      state.videoSettings = {
        ...state.videoSettings,
        [id]: Vue.observable({
          id,
          name,
          channelId,
          channelName,
          options: { autoOpen: false, autoScroll: true, height: 100, autoMaxHeight: false },
          lastViewed: new Date().toISOString(),
          feeds: {
            default: {
              messages: [],
              filters: [],
              deduplication: {},
            },
          },
        }),
      }
    },
    addVideoSettings(state, videoSettings) {
      state.videoSettings = { ...state.videoSettings, [videoSettings.id]: Vue.observable(videoSettings) }
    },
    removeVideoSettings(state, videoId) {
      Vue.delete(state.videoSettings, videoId)
    },
    setVideoOptions(state, { videoId, options }) {
      state.videoSettings[videoId] = { ...state.videoSettings[videoId], options }
    },
    updateVideoSettings(state, { videoId, path, value }) {
      set(state.videoSettings[videoId], path, value)
    },
    updateFilters(state, { videoId, feedName, filters }) {
      const feed = state.videoSettings[videoId].feeds[feedName]
      feed.filters = [].concat(filters)
    },
    addMessage(state, { videoId, feedName, message }) {
      try {
        const { deduplication, messages } = state.videoSettings[videoId].feeds[feedName]
        if (!deduplication[message.id]) {
          Vue.set(deduplication, message.id, true)
        } else {
          return
        }
        messages.push(message)
        while (state.global.limitMsgPerVideo > 0 && messages.length > state.global.limitMsgPerVideo) {
          const toRemove = messages.splice(0, 1)[0]
          Vue.delete(deduplication, toRemove.id)
        }
      } catch (e) {
        console.error('[ytcFilter] addMessage:', e)
      }
    },
    removeMessage(state, { videoId, feedName, messageIndex }) {
      const feed = state.videoSettings[videoId].feeds[feedName]
      const message = feed.messages[messageIndex]
      feed.messages.splice(messageIndex, 1)
      Vue.delete(feed.deduplication, message.id)
    },
    // addBlacklistAuthor(state, value) {
    //   Vue.set(state.global.authorBlacklist, value, true)
    // },
    // removeBlacklistAuthor(state, value) {
    //   Vue.delete(state.global.authorBlacklist, value, true)
    // },
    clearMessages(state, { videoId, feedName }) {
      const feed = state.videoSettings[videoId].feeds[feedName]
      while (feed.messages.length > 0) {
        feed.messages.pop()
      }
      feed.deduplication = {}
      state.videoSettings = { ...state.videoSettings }
    },
    applyProfile(state, { videoId, feedName, profileKey }) {
      const { filters, options } = state.global.profiles[profileKey]
      state.videoSettings[videoId].feeds[feedName].filters = cloneDeep(filters)
      if (options) {
        state.videoSettings[videoId].options = { ...state.videoSettings[videoId].options, ...cloneDeep(options) }
      }
    },
    appendProfile(state, { videoId, feedName, profileKey }) {
      const { filters } = state.global.profiles[profileKey]
      state.videoSettings[videoId].feeds[feedName].filters = state.videoSettings[videoId].feeds[feedName].filters.concat(cloneDeep(filters))
    },
    clearVideoSettings(state) {
      for (const videoSettings of Object.values(state.videoSettings)) {
        for (const feed of Object.values(videoSettings.feeds)) {
          while (feed.messages.length > 0) {
            feed.messages.pop()
          }
          feed.deduplication = {}
        }
      }
      state.videoSettings = {}
    },
    setGlobalDefault(state, profileKey) {
      state.global.globalDefault = profileKey
    },
    setChannelDefault(state, { channelId, profileKey, channelName }) {
      state.global.defaultPerChannel = { ...state.global.defaultPerChannel, [channelId]: { profileKey, channelId, channelName } }
    },
    unsetChannelDefault(state, channelId) {
      const temp = { ...state.global.defaultPerChannel }
      delete temp[channelId]
      state.global.defaultPerChannel = temp
    },
    deleteProfile(state, profileKey) {
      const newGlobal = { ...state.global }
      delete newGlobal.profiles[profileKey]

      if (newGlobal.globalDefault === profileKey) {
        newGlobal.globalDefault = null
      }
      const channelDefaults = Object.values(newGlobal.defaultPerChannel).filter(i => i.profileKey === profileKey)
      for (const channelDefault of channelDefaults) {
        Vue.delete(newGlobal.defaultPerChannel, channelDefault)
      }
      state.global = newGlobal
    },
    setHelpAlert(state, { value, key }) {
      state.helpAlert[key] = value
    },
    resetHelpAlert(state) {
      for (const key of Object.keys(state.helpAlert)) {
        state.helpAlert[key] = true
      }
    },
    migratedAddLastViewedDate(state) {
      const newVideoSettings = { ...state.videoSettings }
      for (const videoSettings of Object.values(state.videoSettings)) {
        videoSettings.lastViewed = new Date().toISOString()
      }
      state.videoSettings = newVideoSettings
    },
  },
  plugins: [
    VuexWebExtensions({
      persistentStates: ['videoSettings', 'global', 'helpAlert'],
      //loggerLevel: 'debug',
    }),
  ],
})

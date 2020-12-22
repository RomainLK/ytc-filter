import Vue from 'vue'
import Vuex from 'vuex'
import VuexWebExtensions from 'vuex-webextensions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    videoSettings: {},
    global: {
      version: null,
      profiles: {},
      defaultPerChannel: {},
      globalDefault: null,
    },
    helpAlert: {
      filterHelp: true,
      profileHelp: true,
    },
  },
  getters: {
    global(state) {
      return state.global
    },
    profiles(state) {
      return state.global.profiles
    },
    channelArchive(state) {
      const archive = { _missing: { id: '_missing', name: 'No channel name', videos: [] } }
      for (const videoSettings of Object.values(state.videoSettings)) {
        if (videoSettings.feeds.default.messages.length > 0) {
          console.log(videoSettings.channelId)
          if (videoSettings.channelId) {
            if (archive[videoSettings.channelId] == null) {
              archive[videoSettings.channelId] = { id: videoSettings.channelId, name: videoSettings.channelName, videos: [] }
            }
            archive[videoSettings.channelId].videos.push(videoSettings)
          } else {
            archive._missing.videos.push(videoSettings)
          }
        }
      }

      return Object.values(archive).filter(c => c.videos.length > 0)
    },
  },
  mutations: {
    setGlobal(state, value) {
      state.global = value
    },
    addProfile(state, profile) {
      state.global.profiles = { ...state.global.profiles, [profile.key]: profile }
    },
    addVideoSettings(state, videoSettings) {
      state.videoSettings = { ...state.videoSettings, [videoSettings.id]: Vue.observable(videoSettings) }
    },
    setVideoOptions(state, { videoId, options }) {
      state.videoSettings[videoId] = { ...state.videoSettings[videoId], options }
    },
    updateFilters(state, { videoId, feedName, filters }) {
      const feed = state.videoSettings[videoId].feeds[feedName]
      feed.filters = [].concat(filters)
    },
    removeMessage(state, { videoId, feedName, message }) {
      const feed = state.videoSettings[videoId].feeds[feedName]
      const index = feed.messages.indexOf(message)
      feed.messages.splice(index, 1)
      feed.messages = [...feed.messages]
      Vue.delete(feed.deduplication, message.id)
      state.videoSettings = { ...state.videoSettings }
    },
    applyProfile(state, { videoId, feedName, profileKey }) {
      const { filters, options } = state.global.profiles[profileKey]
      state.videoSettings[videoId].feeds[feedName].filters = state.videoSettings[videoId].feeds[feedName].filters.concat(filters)
      if (options) {
        state.videoSettings[videoId].options = { ...state.videoSettings[videoId].options, ...options }
      }
    },
    clearVideoSettings(state) {
      state.videoSettings = {}
    },
    setGlobalDefault(state, profileKey) {
      state.global.globalDefault = profileKey
    },
    setChannelDefault(state, { channelId, profileKey, channelName }) {
      state.global.defaultPerChannel = { ...state.global.defaultPerChannel, [channelId]: { profileKey, channelId, channelName } }
    },
    deleteProfile(state, profileKey) {
      const newGlobal = { ...state.global }
      delete newGlobal[profileKey]
      if (newGlobal.globalDefault === profileKey) {
        newGlobal.globalDefault = null
      }
      const channelDefaults = Object.values(newGlobal.defaultPerChannel).filter(i => i.profileKey === profileKey)
      for (const channelDefault of channelDefaults) {
        delete newGlobal[channelDefault]
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
  },
  plugins: [
    VuexWebExtensions({
      persistentStates: ['videoSettings', 'global', 'helpAlert'],
    }),
  ],
})

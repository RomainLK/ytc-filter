<template>
  <div id="ytc-filter">
    <div class="vc-notification" v-show="notificationMsg">
      <div class="notification-content" v-html="notificationMsg"></div>
      <button class="close sm-btn" type="button" @click="notificationMsg = ''">
        X
      </button>
    </div>
    <div class="vc-toolbar">
      <!--div :class="{ hidden: !displayYtc }" class="vc-valign">
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
        <button type="button" class="sm-btn" @click="exportMessagesToPng" title="Screenshot current messages">
          <svg class="svg-icon" viewBox="0 0 20 20" width="18" height="18">
            <path
              d="M10,6.536c-2.263,0-4.099,1.836-4.099,4.098S7.737,14.732,10,14.732s4.099-1.836,4.099-4.098S12.263,6.536,10,6.536M10,13.871c-1.784,0-3.235-1.453-3.235-3.237S8.216,7.399,10,7.399c1.784,0,3.235,1.452,3.235,3.235S11.784,13.871,10,13.871M17.118,5.672l-3.237,0.014L12.52,3.697c-0.082-0.105-0.209-0.168-0.343-0.168H7.824c-0.134,0-0.261,0.062-0.343,0.168L6.12,5.686H2.882c-0.951,0-1.726,0.748-1.726,1.699v7.362c0,0.951,0.774,1.725,1.726,1.725h14.236c0.951,0,1.726-0.773,1.726-1.725V7.195C18.844,6.244,18.069,5.672,17.118,5.672 M17.98,14.746c0,0.477-0.386,0.861-0.862,0.861H2.882c-0.477,0-0.863-0.385-0.863-0.861V7.384c0-0.477,0.386-0.85,0.863-0.85l3.451,0.014c0.134,0,0.261-0.062,0.343-0.168l1.361-1.989h3.926l1.361,1.989c0.082,0.105,0.209,0.168,0.343,0.168l3.451-0.014c0.477,0,0.862,0.184,0.862,0.661V14.746z"
            ></path>
          </svg>
        </button>
      </div-->
      <div>
        <button type="button" @click="ytcPopout()">
          V2 Beta
        </button>
      </div>
      <div v-if="displayYtc" class="vc-toolbar vc-valign button">
        <button type="button" :class="{ active: displayFilters }" @click="displayFilters = !displayFilters">{{ displayFilters ? 'Hide filters' : 'Show filters' }}</button>
      </div>
      <div class="vc-toolbar vc-valign button">
        <button
          v-if="displayYtc"
          type="button"
          class="sm-btn"
          :class="{ active: displayOptions }"
          @click="displayOptions = !displayOptions"
          :title="displayOptions ? 'Hide optiosn' : 'Show options'"
        >
          <svg class="svg-icon" viewBox="0 0 20 20" width="18" height="18">
            <path
              d="M10.032,8.367c-1.112,0-2.016,0.905-2.016,2.018c0,1.111,0.904,2.014,2.016,2.014c1.111,0,2.014-0.902,2.014-2.014C12.046,9.271,11.143,8.367,10.032,8.367z M10.032,11.336c-0.525,0-0.953-0.427-0.953-0.951c0-0.526,0.427-0.955,0.953-0.955c0.524,0,0.951,0.429,0.951,0.955C10.982,10.909,10.556,11.336,10.032,11.336z"
            ></path>
            <path
              d="M17.279,8.257h-0.785c-0.107-0.322-0.237-0.635-0.391-0.938l0.555-0.556c0.208-0.208,0.208-0.544,0-0.751l-2.254-2.257c-0.199-0.2-0.552-0.2-0.752,0l-0.556,0.557c-0.304-0.153-0.617-0.284-0.939-0.392V3.135c0-0.294-0.236-0.532-0.531-0.532H8.435c-0.293,0-0.531,0.237-0.531,0.532v0.784C7.582,4.027,7.269,4.158,6.966,4.311L6.409,3.754c-0.1-0.1-0.234-0.155-0.376-0.155c-0.141,0-0.275,0.055-0.375,0.155L3.403,6.011c-0.208,0.207-0.208,0.543,0,0.751l0.556,0.556C3.804,7.622,3.673,7.935,3.567,8.257H2.782c-0.294,0-0.531,0.238-0.531,0.531v3.19c0,0.295,0.237,0.531,0.531,0.531h0.787c0.105,0.318,0.236,0.631,0.391,0.938l-0.556,0.559c-0.208,0.207-0.208,0.545,0,0.752l2.254,2.254c0.208,0.207,0.544,0.207,0.751,0l0.558-0.559c0.303,0.154,0.616,0.285,0.938,0.391v0.787c0,0.293,0.238,0.531,0.531,0.531h3.191c0.295,0,0.531-0.238,0.531-0.531v-0.787c0.322-0.105,0.636-0.236,0.938-0.391l0.56,0.559c0.208,0.205,0.546,0.207,0.752,0l2.252-2.254c0.208-0.207,0.208-0.545,0.002-0.752l-0.559-0.559c0.153-0.303,0.285-0.615,0.389-0.938h0.789c0.295,0,0.532-0.236,0.532-0.531v-3.19C17.812,8.495,17.574,8.257,17.279,8.257z M16.747,11.447h-0.653c-0.241,0-0.453,0.164-0.514,0.398c-0.129,0.496-0.329,0.977-0.594,1.426c-0.121,0.209-0.089,0.473,0.083,0.645l0.463,0.465l-1.502,1.504l-0.465-0.463c-0.174-0.174-0.438-0.207-0.646-0.082c-0.447,0.262-0.927,0.463-1.427,0.594c-0.234,0.061-0.397,0.271-0.397,0.514V17.1H8.967v-0.652c0-0.242-0.164-0.453-0.397-0.514c-0.5-0.131-0.98-0.332-1.428-0.594c-0.207-0.123-0.472-0.09-0.646,0.082l-0.463,0.463L4.53,14.381l0.461-0.463c0.169-0.172,0.204-0.434,0.083-0.643c-0.266-0.461-0.467-0.939-0.596-1.43c-0.06-0.234-0.272-0.398-0.514-0.398H3.313V9.319h0.652c0.241,0,0.454-0.162,0.514-0.397c0.131-0.498,0.33-0.979,0.595-1.43c0.122-0.208,0.088-0.473-0.083-0.645L4.53,6.386l1.503-1.504l0.46,0.462c0.173,0.172,0.437,0.204,0.646,0.083c0.45-0.265,0.931-0.464,1.433-0.597c0.233-0.062,0.396-0.274,0.396-0.514V3.667h2.128v0.649c0,0.24,0.161,0.452,0.396,0.514c0.502,0.133,0.982,0.333,1.433,0.597c0.211,0.12,0.475,0.089,0.646-0.083l0.459-0.462l1.504,1.504l-0.463,0.463c-0.17,0.171-0.202,0.438-0.081,0.646c0.263,0.448,0.463,0.928,0.594,1.427c0.061,0.235,0.272,0.397,0.514,0.397h0.651V11.447z"
            ></path>
          </svg>
        </button>

        <button type="button" @click="displayYtc = !displayYtc" :title="displayYtc ? 'Close ytcFilter' : 'Show ytcFilter'">{{ displayYtc ? 'X' : 'ytcFilter' }}</button>
      </div>
    </div>
    <div v-show="displayYtc" class="vc-container">
      <!--Filters-->
      <div v-show="displayFilters" class="vc-options">
        <form>
          <div class="vc-options-item">
            <label for="filter-type">Filter type:</label>
            <select id="filter-type" v-model="filterType">
              <option value="msgIncludes">Message includes</option>
              <option value="author">Author name is</option>
              <option value="isMember">Author is member</option>
              <option value="isModerator">Author is moderator</option>
              <option value="isOwner">Author is owner</option>
              <option value="isVerified">Author is verified</option>
              <option value="isSuperChat">Message is Super Chat</option>
              <option value="regex">Regex</option>
            </select>
          </div>
          <div class="vc-options-item" v-show="filterHasValue">
            <label for="filter-value">{{ valueLabel }}</label>
            <input id="filter-value" type="text" v-model="filterInput" />
          </div>
          <div class="vc-options-item flex-align-center" v-show="filterHasCaseSensitive">
            <label for="case-sensitive">Filter is case sensitive:</label>
            <input id="case-sensitive" type="checkbox" v-model="caseSensitive" />
          </div>
          <button type="submit" @click.prevent="addFilter" title="Add filter">Add filter</button>
        </form>
        <div class="vc-options-item">
          <div class="vc-title">
            Current filter:
            <button type="button" class="sm-btn" title="Export current filters" @click="exportFilters">
              <svg class="svg-icon" viewBox="0 0 20 20" width="13" height="13">
                <path
                  d="M8.416,3.943l1.12-1.12v9.031c0,0.257,0.208,0.464,0.464,0.464c0.256,0,0.464-0.207,0.464-0.464V2.823l1.12,1.12c0.182,0.182,0.476,0.182,0.656,0c0.182-0.181,0.182-0.475,0-0.656l-1.744-1.745c-0.018-0.081-0.048-0.16-0.112-0.224C10.279,1.214,10.137,1.177,10,1.194c-0.137-0.017-0.279,0.02-0.384,0.125C9.551,1.384,9.518,1.465,9.499,1.548L7.76,3.288c-0.182,0.181-0.182,0.475,0,0.656C7.941,4.125,8.234,4.125,8.416,3.943z M15.569,6.286h-2.32v0.928h2.32c0.512,0,0.928,0.416,0.928,0.928v8.817c0,0.513-0.416,0.929-0.928,0.929H4.432c-0.513,0-0.928-0.416-0.928-0.929V8.142c0-0.513,0.416-0.928,0.928-0.928h2.32V6.286h-2.32c-1.025,0-1.856,0.831-1.856,1.856v8.817c0,1.025,0.832,1.856,1.856,1.856h11.138c1.024,0,1.855-0.831,1.855-1.856V8.142C17.425,7.117,16.594,6.286,15.569,6.286z"
                ></path>
              </svg>
            </button>
            <button type="button" class="sm-btn" title="Import filters" :class="{ active: displayExport }" @click="displayExport = !displayExport">
              <svg class="svg-icon" viewBox="0 0 20 20" width="13" height="13">
                <path
                  d="M15.608,6.262h-2.338v0.935h2.338c0.516,0,0.934,0.418,0.934,0.935v8.879c0,0.517-0.418,0.935-0.934,0.935H4.392c-0.516,0-0.935-0.418-0.935-0.935V8.131c0-0.516,0.419-0.935,0.935-0.935h2.336V6.262H4.392c-1.032,0-1.869,0.837-1.869,1.869v8.879c0,1.031,0.837,1.869,1.869,1.869h11.216c1.031,0,1.869-0.838,1.869-1.869V8.131C17.478,7.099,16.64,6.262,15.608,6.262z M9.513,11.973c0.017,0.082,0.047,0.162,0.109,0.226c0.104,0.106,0.243,0.143,0.378,0.126c0.135,0.017,0.274-0.02,0.377-0.126c0.064-0.065,0.097-0.147,0.115-0.231l1.708-1.751c0.178-0.183,0.178-0.479,0-0.662c-0.178-0.182-0.467-0.182-0.645,0l-1.101,1.129V1.588c0-0.258-0.204-0.467-0.456-0.467c-0.252,0-0.456,0.209-0.456,0.467v9.094L8.443,9.553c-0.178-0.182-0.467-0.182-0.645,0c-0.178,0.184-0.178,0.479,0,0.662L9.513,11.973z"
                ></path>
              </svg>
            </button>
          </div>

          <div v-if="displayExport">
            <form>
              <textarea placeholder="Paste filters here" v-model="importFilterTextArea" />
              <div>
                <button type="submit" @click.prevent="importFilters">Import</button>
              </div>
            </form>
          </div>
          <ul class="vc-filter-list">
            <li class="vc-filter-item" v-for="(filter, index) in filters" :key="'f' + index">
              <span v-if="!filter.regex && filter.caseSensitive">(Case sensitive)</span>
              <span>{{ getFilterLabel(filter) }}</span>
              <!--span v-if="filter.author">Author: {{ filter.author }}</span>
              <span v-else-if="filter.msgIncludes">Text includes: {{ filter.msgIncludes }}</span>
              <span v-else-if="filter.regex">Regex: {{ filter.regex }}</span>
              <span v-else-if="filter.isMember">Author has membership</span>
              <span v-else-if="filter.isModerator">Author is moderator</span>
              <span v-else-if="filter.isOwner">Author is owner</span>
              <span v-else-if="filter.isSuperChat">Message is Super Chat</span>
              <span v-else-if="filter.isVerified">Author is verified</span-->
              <button type="button" class="sm-btn" @click="removeFilter(filter)" title="Remove filter">
                <svg class="svg-icon" viewBox="0 0 20 20" width="13" height="13">
                  <path
                    d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"
                  ></path>
                </svg>
              </button>
            </li>
          </ul>
          <div>Session stats (filtered/total): {{ stats.filteredNb }}/{{ stats.msgNb }}</div>
        </div>
      </div>
      <!--Options-->
      <div v-show="displayOptions" class="vc-options">
        <div class="vc-options-item">
          <div class="vc-title">Chat:</div>
          <label for="auto-open-opt" class="flex-align-center pointer" title="Automatically open ytcFilter on this stream">
            Auto open:
            <input id="auto-open-opt" type="checkbox" v-model="options.autoOpen" />
          </label>
          <label for="auto-scroll-opt" class="flex-align-center pointer" title="Automatically scroll chat when it's at the bottom">
            Auto scroll:
            <input id="auto-scroll-opt" type="checkbox" v-model="options.autoScroll" />
          </label>
          <label for="height-opt" class="flex-align-center">
            Height: <input type="range" id="height-opt" class="width" min="50" :max="maxHeight" :disabled="this.options.autoMaxHeight" v-model="options.height" step="1" /> Auto max
            height:<input id="max-height-opt" type="checkbox" v-model="options.autoMaxHeight" />
          </label>
          <span>{{ heightPx }}</span>
        </div>
        <div class="vc-options-item">
          <button type="button" @click="clearMessages" title="Remove all captured messages">Clear chat</button>
        </div>
        <div class="vc-options-item">
          <div class="vc-title">Profile:</div>
          <select v-model="editingProfileKey">
            <option :value="null" disabled selected hidden>Choose profile...</option>
            <option v-for="(profile, key) in global.profiles" :key="key" :value="key">
              {{ profile.name || key }}
              {{ global.defaultPerChannel && global.defaultPerChannel[CHANNEL_ID] && key === global.defaultPerChannel[CHANNEL_ID].profileKey ? '(Channel)' : '' }}
              {{ key === global.globalDefault ? '(Global)' : '' }}
            </option>
          </select>
          <button type="button" class="sm-btn" @click="createNewProfile" title="Create new profile">+</button>
          <div v-if="editingProfileKey != null">
            <div class="vc-options-item">
              <label for="profile-name">Name:</label>
              <input id="profile-name" type="text" v-model="global.profiles[editingProfileKey].name" />
            </div>
            <div class="vc-options-item">
              <button type="button" @click="saveProfile()" title="Save current filter, options and name on this profile">Save</button>
              <button type="button" @click="applyProfileClick()" title="Apply the filters and options on this video. It will replace existing options">Apply</button>
              <button type="button" @click="removeProfile()" title="Delete the selected profile">Delete</button>
            </div>
            <div class="vc-title">
              Profile's default:
            </div>
            <ul class="vc-filter-list">
              <li class="vc-filter-item" v-if="editingProfileKey === global.globalDefault">Global default</li>
              <li class="vc-filter-item" v-for="defaultInfo in profileDefaultChannel" :key="defaultInfo.channelId">
                <a v-if="defaultInfo.channelId !== 'Studio'" :href="'https://www.youtube.com/channel/' + defaultInfo.channelId" target="_blank">
                  {{ defaultInfo.channelName }}
                </a>
                <span v-else>
                  {{ defaultInfo.channelName }}
                </span>
              </li>
            </ul>

            <div>
              <button type="button" @click="setAsGlobalDefault()" title="The selected profile will be automatically applied to all new stream if no channel default were set">
                Set as global default
              </button>
              <button type="button" @click="setAsChannelDefault()" title="The selected profile will be automatically applied to all new stream from this channel">
                Set as channel default
              </button>
            </div>
          </div>
        </div>
        <div class="vc-options-item">
          <div class="vc-title">
            About:
          </div>
          <button type="button" @click="notifyChangelog">Changelog</button> <a href="https://github.com/RomainLK/ytc-filter/wiki" target="_blank">Wiki</a>
        </div>
      </div>
      <!--Content-->
      <message-list :video-id="videoId" :height="heightPx" @notify="notify" />

      <div v-if="showMoreCommentsDisplayed" class="vc-text-center">No new messages can be filtered when the chat isn't autoscrolling</div>
    </div>
  </div>
</template>
<script>
import { ChatObserver } from '@/utils/chat-observer'
import { MoreCommentsObserver } from '@/utils/more-comments-observer'
import { getVideoId, getChannelId, getChannelName, getVideoName } from '@/utils/information-extractor'
import cache from 'webext-storage-cache'
import RegexParser from 'regex-parser'
import Vue from 'vue'
import { gtr } from 'semver'
import manifest from '@/manifest.json'
import changelog from '@/../changelog.md'
import xss from 'xss'
import copy from 'copy-to-clipboard'
import { ytcMount } from '@/utils/mount'
import messageList from '@/components/message-list'
import { eventBus } from '@/utils/event-bus'
import { applyFilter } from '@/utils/apply-filter'

const CHANNEL_ID = getChannelId()
//const VIDEO_ID = getVideoId()
// const MAX_AGE = { days: 7 }
// const MAX_GLOBAL_AGE = { days: 9999 }
// const VIDEO_STORAGE_KEY = `vcVideo${VIDEO_ID}`
// const GLOBAL_STORAGE_KEY = 'vcGlobal'
//const VERSION_STORAGE_KEY = 'vcVersion'

let deduplicationMap = {}

export default {
  components: {
    messageList,
  },
  data() {
    return {
      videoId: getVideoId(),
      observer: {},
      displayYtc: false,
      displayFilters: false,
      displayOptions: false,
      displayExport: false,
      caseSensitive: false,
      msgOptions: null,
      filterInput: '',
      messages: [],
      filters: [],
      filterType: 'msgIncludes',
      firstOpening: true,
      showMoreCommentsDisplayed: false,
      stats: {
        msgNb: 0,
        filteredNb: 0,
      },
      options: {
        autoOpen: false,
        autoScroll: true,
        height: 100,
        autoMaxHeight: false,
      },
      global: {
        profiles: {},
        defaultPerChannel: {},
        globalDefault: null,
      },
      notificationMsg: '',
      notificationTimeOut: null,
      importFilterTextArea: '',
      editingProfileKey: null,
      maxHeight: 900,
      CHANNEL_ID,
      ready: false,
    }
  },
  async mounted() {
    console.log('[ytcFilter] Mounting ytcFilter component')
    const loadButton = document.querySelector('#remount-ytc')
    if (loadButton) {
      document.removeEventListener('DOMContentLoaded', ytcMount)
      document.querySelector('.ytc-loading').remove()
    }
    this.maxHeight = document.getElementById('content-pages').getBoundingClientRect().height - 50
    this.observer = new ChatObserver()
    this.observer.observe()
    this.observer.listeners.push(this.onMessage.bind(this))
    this.moreCommentsObserver = new MoreCommentsObserver()
    this.moreCommentsObserver.listeners.push(e => {
      this.showMoreCommentsDisplayed = !e.attributes.disabled
    })
    await this.loadGlobal()
    await this.checkUpdate()
    if (!(await this.loadConfig())) {
      this.saveConfig()
      const channelDefault = this.global.defaultPerChannel[CHANNEL_ID]
      if (channelDefault) {
        await this.applyProfile(channelDefault.profileKey)
        const profileName = this.global.profiles[channelDefault.profileKey].name
        this.notify(`Default channel profile "${profileName}" was applied.`)
      } else if (this.global.globalDefault) {
        await this.applyProfile(this.global.globalDefault)
        const profileName = this.global.profiles[this.global.globalDefault].name
        this.notify(`Default global profile "${profileName}" was applied.`)
      }
    }

    if (this.filters.length === 0) {
      this.displayFilters = true
    }
    this.displayYtc = this.options.autoOpen

    const isReady = () => {
      if (this.$store.state?.global?.version == null) {
        console.log('[ytcFilter] store not ready')
        setTimeout(isReady, 1000)
      } else {
        this.ready = true
        console.log('[ytcFilter] store ready')
      }
    }
    /*if (chrome) {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log('[ytcFilter] Received message', request)
        if (request) {
          switch (request.action) {
            case 'reload':
              this.loadConfig()
              this.loadGlobal()
          }
        }
      })
    } else {
    }*/

    this.$store.subscribe((mutation, state) => {
      console.log('[ytcFilter] reload')
      this.loadConfig()
      this.loadGlobal()
    })

    isReady()

    console.log('[ytcFilter] ytcFilter mount ended')
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
      return Number(this.options.height)
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
  },
  watch: {
    options: {
      handler: 'saveConfig',
      deep: true,
    },
    displayYtc() {
      if (this.firstOpening) {
        eventBus.$emit('first-opening')
        this.firstOpening = false
      }
    },
  },
  methods: {
    async checkUpdate(force = false) {
      //return

      let lastVersion = this.$store.state.global.version || '0.0.0'
      //todo remove
      for (const [key, profile] of Object.entries(this.global.profiles)) {
        Vue.set(profile, 'key', key)
      }

      this.$store.commit('setGlobal', { ...this.global, version: manifest.version })

      const handleStorage = storage => {
        for (const [key, value] of Object.entries(storage)) {
          if (key.startsWith('cache:vcVideo')) {
            const id = key.slice(13)
            const parsed = JSON.parse(value.data)
            parsed.videoId = id
            parsed.feeds = {
              default: {
                messages: parsed.messages,
                deduplication: parsed.deduplication,
                filters: parsed.filters.map(f => {
                  const newFilter = {}
                  for (const [key, value] of Object.entries(f)) {
                    if (key === 'caseSensitive') {
                      newFilter.caseSensitive = value
                    } else {
                      newFilter.type = key
                      newFilter.value = value
                    }
                  }
                }),
              },
            }
            delete parsed.messages
            delete parsed.deduplication
            delete parsed.filters
            this.$store.commit('addVideoSettings', parsed)
          }
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
      }
      //  if (await cache.has(VERSION_STORAGE_KEY)) {
      //  lastVersion = await cache.get(VERSION_STORAGE_KEY)
      //}

      if (gtr(manifest.version, lastVersion)) {
        //Migration from 1.5.0 to 1.6.1 for default profile
        if (this.global.profiles.default && this.global.profiles.default.name == null && this.global.globalDefault == null) {
          this.global.profiles.default.name = 'Default'
          this.global.globalDefault = 'default'
          this.saveGlobal()
        }
        if (this.$store.global.version == null) {
          //Migration to 2.0.0
          this.$store.commit('setGlobal', { ...this.global, version: manifest.version })
        }
        this.notifyChangelog()
        //cache.set(VERSION_STORAGE_KEY, manifest.version, MAX_GLOBAL_AGE)
      }
    },
    notifyChangelog() {
      this.notify(changelog, 0)
    },
    getFilterLabel(filter) {
      switch (filter.type) {
        case 'msgIncludes':
          return `Text includes :${filter.value}`
        case 'author':
          return `Author :${filter.value}`
        case 'regex':
          return `Regex :${filter.value}`
        case 'isMember':
          return `Author has membership`
        case 'isModerator':
          return `Author is moderator`
        case 'isOwner':
          return `Author is owner`
        case 'isSuperChat':
          return `Message is Super Chat`
        case 'isVerified':
          return `Author is verified`
      }
    },
    addFilter() {
      if (this.filterHasValue && !this.filterInput) {
        this.notify('This filter requires a value')
        return
      }
      this.filters.push({ type: this.filterType, value: this.filterInput || true, caseSensitive: this.caseSensitive })
      this.filterInput = ''
      this.saveConfig()
    },
    onMessage(msg) {
      this.stats.msgNb++
      for (const filter of this.filters) {
        if (applyFilter(filter, msg)) {
          this.addMessage(msg)
        }
        // if (filter.msgIncludes) {
        //   const caseSensitive = filter.caseSensitive && msg.message.includes(filter.msgIncludes)
        //   const caseInsensitive = !filter.caseSensitive && msg.message.toLowerCase().includes(filter.msgIncludes.toLowerCase())
        //   if (caseSensitive || caseInsensitive) {
        //     this.addMessage(msg)
        //   }
        // } else if (filter.author) {
        //   const caseSensitive = filter.caseSensitive && msg.author === filter.author
        //   const caseInsensitive = !filter.caseSensitive && msg.author.toLowerCase() === filter.author.toLowerCase()
        //   if (caseSensitive || caseInsensitive) {
        //     this.addMessage(msg)
        //   }
        // } else if (filter.isMember && msg.authorType === 'member') {
        //   this.addMessage(msg)
        // } else if (filter.isModerator && msg.authorType === 'moderator') {
        //   this.addMessage(msg)
        // } else if (filter.isOwner && msg.authorType === 'owner') {
        //   this.addMessage(msg)
        // } else if (filter.isSuperChat && msg.messageType === 'paid-message') {
        //   this.addMessage(msg)
        // } else if (filter.isVerified && msg.verified) {
        //   this.addMessage(msg)
        // } else if (filter.regex) {
        //   let regex = regexCache.get(filter)
        //   if (!regex) {
        //     regex = RegexParser(filter.regex)
        //     regexCache.set(filter, regex)
        //   }
        //   if (regex.test(msg.message)) {
        //     this.addMessage(msg)
        //   }
        // }
      }
    },
    async addMessage(msg) {
      if (!deduplicationMap[msg.id]) {
        deduplicationMap[msg.id] = true
      } else {
        return
      }
      this.stats.filteredNb++
      msg.html = xss(msg.html, { stripIgnoreTag: true })

      this.messages.push(msg)

      this.saveConfig()
    },

    async goToBottom() {
      await this.$nextTick()
      //this.$refs.content.scrollTop = this.$refs.content.scrollHeight
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

    async saveProfile() {
      const name = this.global.profiles[this.editingProfileKey].name
      if (!name) {
        console.warn('saveProfile - Missing profile name')
        return
      }
      const profile = Vue.observable({
        key: this.editingProfileKey,
        name,
        filters: [...this.filters],
        options: {
          ...this.options,
        },
      })
      this.$set(this.global.profiles, this.editingProfileKey, profile)
      await this.saveGlobal()
      this.notify(`Profile "${name}" was saved`)
    },
    async removeProfile() {
      const key = this.editingProfileKey
      this.editingProfileKey = null

      const profile = this.global.profiles[key]
      this.$delete(this.global.profiles, key)
      if (this.global.globalDefault === key) {
        this.global.globalDefault = null
      }
      const channelDefaults = Object.values(this.defaultPerChannel).filter(i => i.profileKey === key)
      for (const channelDefault of channelDefaults) {
        delete this.defaultPerChannel[channelDefault]
      }

      this.notify(`Profile "${profile.name}" was removed`)
      await this.saveGlobal()
    },
    saveGlobal() {
      this.$store.commit('setGlobal', this.global)
    },

    async loadGlobal() {
      // const hasGlobal = await cache.has(GLOBAL_STORAGE_KEY)
      // if (!hasGlobal) {
      //   return false
      // }
      try {
        this.global = {
          ...this.$store.getters.global,
          /*profiles: {},
          defaultPerChannel: {},
          globalDefault: null,
          ...JSON.parse(await cache.get(GLOBAL_STORAGE_KEY)),*/
        }
        console.log('[ytcFilter]  Load global', this.global)
      } catch (e) {
        console.warn('applyProfile - Failed to load global')
        return false
      }
    },

    async applyProfile(key) {
      key = key ?? this.editingProfileKey
      try {
        const { profiles } = this.global
        if (profiles?.[key]) {
          this.$store.commit('applyProfile', { videoId: getVideoId(), feedName: 'default', profileKey: key })
          this.loadConfig()
          return true
        } else {
          return false
        }
      } catch (e) {
        console.warn('applyProfile - Failed to apply profile')
        console.error(e)
        return false
      }
    },

    async applyProfileClick() {
      if (await this.applyProfile()) {
        const profile = this.global.profiles[this.editingProfileKey]
        this.notify(`The profile "${profile.name}" was applied to the stream`)
      }
    },

    setAsGlobalDefault() {
      this.global.globalDefault = this.editingProfileKey
      this.saveGlobal()
    },

    setAsChannelDefault() {
      const info = Vue.observable({
        profileKey: this.editingProfileKey,
        channelName: getChannelName(),
        channelId: CHANNEL_ID,
      })
      if (!CHANNEL_ID) {
        this.notify('Channel default only works on Youtube.com embedded chat')
      }
      this.$set(this.global.defaultPerChannel, CHANNEL_ID, info)
      this.saveGlobal()
    },

    saveConfig() {
      /*await cache.set(
        VIDEO_STORAGE_KEY,
        JSON.stringify({
          messages: this.messages,
          filters: this.filters,
          options: this.options,
          deduplication: deduplicationMap,
        }),
        MAX_AGE
      )*/
      this.$store.commit('addVideoSettings', {
        id: getVideoId(),
        name: getVideoName(),
        channelId: getChannelId(),
        channelName: getChannelName(),
        options: this.options,
        feeds: {
          default: {
            messages: this.messages,
            filters: this.filters,
            options: this.options,
            deduplication: deduplicationMap,
          },
        },
      })
    },

    async loadConfig() {
      const hasConfig = this.$store.state.videoSettings[getVideoId()]
      console.log('[ytcFilter] Has config:', hasConfig)
      if (!hasConfig) {
        return false
      }
      try {
        const config = {
          ...this.$store.state.videoSettings[getVideoId()].feeds.default,
          options: this.$store.state.videoSettings[getVideoId()].options,
        }
        console.log('[ytcFilter] Load config')
        this.setConfig(config)
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

    resetMessageOptions() {
      this.msgOptions = null
    },

    // deleteMessage(msg) {
    //   const index = this.messages.indexOf(msg)
    //   this.messages.splice(index, 1)
    //   delete deduplicationMap[msg.id]
    //   this.resetMessageOptions()
    //   this.saveConfig()
    // },

    scrollYoutubeChatToId(id) {},

    exportFilters() {
      if (copy(JSON.stringify(this.filters))) {
        this.notify('Filters were copied to your clipboard')
      } else {
        this.notify('Impossible to copy the filters to your clipboard. This may be an issue with you browser.')
      }
    },

    importFilters() {
      try {
        const parsed = JSON.parse(this.importFilterTextArea)
        this.filters = parsed
        this.importFilterTextArea = ''
        this.displayExport = false
      } catch (e) {
        this.notify('Error when importing filters. Please check you export.')
      }
    },

    createNewProfile() {
      const key = Math.random()
        .toString(36)
        .substr(2, 9)
      this.$set(this.global.profiles, key, { name: '', filters: [], options: [] })
      this.editingProfileKey = key
    },
    ytcPopout() {
      chrome.runtime.sendMessage({
        action: 'popout',
        payload: {
          videoId: getVideoId(),
          channelId: getChannelId(),
          channelName: getChannelName(),
          videoName: getVideoName(),
        },
      })
    },
  },
}
</script>

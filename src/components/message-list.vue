<template>
  <div id="message-list">
    <div class="toolbar py-2">
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
      <button type="button" v-show="!isPopout" class="sm-btn" @click="exportMessagesToPng" title="Screenshot current messages">
        <svg class="svg-icon" viewBox="0 0 20 20" width="18" height="18">
          <path
            d="M10,6.536c-2.263,0-4.099,1.836-4.099,4.098S7.737,14.732,10,14.732s4.099-1.836,4.099-4.098S12.263,6.536,10,6.536M10,13.871c-1.784,0-3.235-1.453-3.235-3.237S8.216,7.399,10,7.399c1.784,0,3.235,1.452,3.235,3.235S11.784,13.871,10,13.871M17.118,5.672l-3.237,0.014L12.52,3.697c-0.082-0.105-0.209-0.168-0.343-0.168H7.824c-0.134,0-0.261,0.062-0.343,0.168L6.12,5.686H2.882c-0.951,0-1.726,0.748-1.726,1.699v7.362c0,0.951,0.774,1.725,1.726,1.725h14.236c0.951,0,1.726-0.773,1.726-1.725V7.195C18.844,6.244,18.069,5.672,17.118,5.672 M17.98,14.746c0,0.477-0.386,0.861-0.862,0.861H2.882c-0.477,0-0.863-0.385-0.863-0.861V7.384c0-0.477,0.386-0.85,0.863-0.85l3.451,0.014c0.134,0,0.261-0.062,0.343-0.168l1.361-1.989h3.926l1.361,1.989c0.082,0.105,0.209,0.168,0.343,0.168l3.451-0.014c0.477,0,0.862,0.184,0.862,0.661V14.746z"
          ></path>
        </svg>
      </button>
    </div>
    <div id="ytc-messages" class="vc-content" :style="{ height: height }" ref="content">
      <div class="vc-message-item" v-for="(msg, index) in messages" :key="msg.id">
        <span v-if="msg.timestamp && msgOptions !== index" class="vc-timestamp" @click="msgOptions = index">{{ msg.timestamp }}</span>
        <span v-else class="vc-options">
          <button type="button" class="sm-btn" title="Go to message" @click="scrollYoutubeChatToId(msg.id)" v-show="!isPopout">
            <svg class="svg-icon" viewBox="0 0 20 20" width="13" height="13">
              <path
                d="M18.125,15.804l-4.038-4.037c0.675-1.079,1.012-2.308,1.01-3.534C15.089,4.62,12.199,1.75,8.584,1.75C4.815,1.75,1.982,4.726,2,8.286c0.021,3.577,2.908,6.549,6.578,6.549c1.241,0,2.417-0.347,3.44-0.985l4.032,4.026c0.167,0.166,0.43,0.166,0.596,0l1.479-1.478C18.292,16.234,18.292,15.968,18.125,15.804 M8.578,13.99c-3.198,0-5.716-2.593-5.733-5.71c-0.017-3.084,2.438-5.686,5.74-5.686c3.197,0,5.625,2.493,5.64,5.624C14.242,11.548,11.621,13.99,8.578,13.99 M16.349,16.981l-3.637-3.635c0.131-0.11,0.721-0.695,0.876-0.884l3.642,3.639L16.349,16.981z"
              ></path>
            </svg>
          </button>
          <button type="button" class="sm-btn" title="Delete message" @click="deleteMessage(msg)">
            <svg class="svg-icon" viewBox="0 0 20 20" width="13" height="13">
              <path
                d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"
              ></path>
            </svg>
          </button>
          <button v-if="msg.timestamp" type="button" class="sm-btn" title="Hide message options" @click="resetMessageOptions">
            <svg class="svg-icon" viewBox="0 0 20 20" width="13" height="13">
              <path
                d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"
              ></path>
            </svg>
          </button>
        </span>
        <span class="vc-author" :class="{ author: msg.authorType === 'moderator', owner: msg.authorType === 'owner' }">
          {{ msg.author
          }}<svg v-if="msg.authorType === 'moderator'" class="author-icon" viewBox="0 0 16 16" preserveAspectRatio="xMidYMid meet" focusable="false" width="16" height="16">
            <g>
              <path
                d="M9.64589146,7.05569719 C9.83346524,6.562372 9.93617022,6.02722257 9.93617022,5.46808511 C9.93617022,3.00042984 7.93574038,1 5.46808511,1 C4.90894765,1 4.37379823,1.10270499 3.88047304,1.29027875 L6.95744681,4.36725249 L4.36725255,6.95744681 L1.29027875,3.88047305 C1.10270498,4.37379824 1,4.90894766 1,5.46808511 C1,7.93574038 3.00042984,9.93617022 5.46808511,9.93617022 C6.02722256,9.93617022 6.56237198,9.83346524 7.05569716,9.64589147 L12.4098057,15 L15,12.4098057 L9.64589146,7.05569719 Z"
              ></path>
            </g>
          </svg>
          <img v-if="msg.badgeUrl" :src="msg.badgeUrl" />
          <div class="vc-author-verified" v-if="msg.verified">
            <svg viewBox="0 0 16 16" focusable="false" width="18" height="18">
              <g transform="scale(0.66)"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path></g>
            </svg>
          </div>
        </span>
        <span class="vc-purchase-amount" :style="{ 'background-color': msg.backgroundColor ? msg.backgroundColor : 'none' }"> {{ msg.purchaseAmount }} </span>
        <span class="vc-message" v-html="msg.html"></span>
      </div>
    </div>
  </div>
</template>
<script>
import domtoimage from 'dom-to-image-improved'
import { saveAs } from 'file-saver'
import { eventBus } from '@/utils/event-bus'

export default {
  props: {
    videoId: {
      type: String,
      required: true,
    },
    feedName: {
      type: String,
      default: 'default',
    },
    height: {
      type: String,
    },
    isPopout: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      msgOptions: null,
    }
  },
  computed: {
    currentVideoSettings() {
      return this.$store.state.videoSettings[this.videoId]
    },
    messages() {
      return this.currentVideoSettings?.feeds[this.feedName].messages
    },
    autoSrollEnabled() {
      return this.currentVideoSettings?.options.autoScroll
    },
  },
  mounted() {
    console.log('[ytcFilter] Message List mounting. Video id:', this.videoId, this.$store.state.videoSettings)

    if (this.autoSrollEnabled) {
      this.goToBottom()
      eventBus.$on('first-opening', () => {
        this.goToBottom()
      })
    }
  },
  watch: {
    'messages.length': async function() {
      const isAtBottom = this.$refs.content.scrollTop + this.$refs.content.clientHeight >= this.$refs.content.scrollHeight - 50
      if (this.autoSrollEnabled && isAtBottom) {
        await this.goToBottom()
      }
    },
  },
  methods: {
    scrollYoutubeChatToId(id) {
      //TODO to be removed
      const ytMsg = document.getElementById(id)
      if (!ytMsg) {
        this.$emit('notify', 'The message is not currently available in Youtube chat.')
        return
      }
      document.querySelector('#item-scroller').scrollTo(0, ytMsg.offsetTop)
    },
    deleteMessage(message) {
      this.$store.commit('removeMessage', { videoId: this.videoId, feedName: this.feedName, message })
      this.resetMessageOptions()
    },
    resetMessageOptions() {
      this.msgOptions = null
    },
    goToTop() {
      this.$refs.content.scrollTop = 0
    },
    async goToBottom() {
      await this.$nextTick()
      this.$refs.content.scrollTop = this.$refs.content.scrollHeight
    },
    exportMessagesToPng() {
      const messageNode = document.getElementById('ytc-messages')
      domtoimage
        .toBlob(messageNode, {
          width: messageNode.scrollWidth,
          height: messageNode.scrollHeight,
          canvas: {
            // Canvas for cropping screenshot
            sx: 0,
            sy: 0,
            dy: -messageNode.scrollTop,
            dx: 0,
            sh: messageNode.scrollHeight,
            sw: messageNode.scrollWidth,
            dh: messageNode.scrollHeight,
            dw: messageNode.scrollWidth,
            height: messageNode.clientHeight + 50,
          },
        })
        .then(blob => {
          saveAs(blob, `ytcFilter-${this.videoId}.png`)
        })
    },
  },
}
</script>

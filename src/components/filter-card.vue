<template>
  <div class="card">
    <div class="card-body">
      <div class="float-right">
        <button class="btn btn-secondary btn-sm" @click="openPresetModal">
          Load preset
        </button>
        <button class="btn btn-secondary btn-sm" @click="exportFilters">
          Export
        </button>
        <button class="btn btn-secondary btn-sm" @click="showImportModal = true">
          Import
        </button>
        <button class="btn btn-primary btn-sm" @click="addFilter">
          Add filter
        </button>
      </div>
      <h5 class="card-title">Filters</h5>

      <help-alert alert-key="filterHelp" class="mb-3">
        Here you can configure filters which will capture messages from Youtube Livechat, based on a condition. A filter has a type, and some of them may also accept a value.
        Filters are updated in real time. There is no need to save. Note that filters are saved per video.
      </help-alert>

      <div class="pb-2" v-for="(filter, index) in filters" :key="'f' + index">
        <filter-condition :filter="filter" @delete="removeFilter" @change="onChange" />
      </div>
    </div>
    <b-modal title="Import filters" @ok="importFilters" v-model="showImportModal">
      <textarea class="form-control" placeholder="Paste your filters here" v-model="importFilterTextArea" />
    </b-modal>
    <b-modal title="Load preset" v-model="showPresetModal">
      <select v-model="selectedProfile" class="form-control">
        <option :value="null" disabled>Select a preset</option>
        <option v-for="(profile, key) of profiles" :key="key" :value="profile">{{ profile.name }} {{ key === $store.state.global.globalDefault ? '(Global)' : '' }}</option>
      </select>
      <template #modal-footer>
        <b-button variant="secondary" @click="closePresetModal">Close</b-button>
        <b-button variant="primary" :disabled="!selectedProfile" @click="appendFilters">Append filters</b-button>
        <b-button v-if="videoId" variant="primary" :disabled="!selectedProfile" @click="applyProfile">Apply</b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import filterCondition from '@/components/filter-condition'
import helpAlert from '@/components/help-alert'
import copy from 'copy-to-clipboard'
import { filterMigrate } from '@/utils/migrate'

export default {
  components: {
    filterCondition,
    helpAlert,
  },
  props: {
    filters: {
      type: Array,
    },
    canApplyProfile: {
      type: Boolean,
      default: false,
    },
    videoId: {
      type: String,
    },
    feedName: {
      type: String,
      default: 'default',
    },
  },
  data() {
    return {
      importFilterTextArea: '',
      showImportModal: false,
      selectedProfile: null,
      showPresetModal: false,
    }
  },
  computed: {
    profiles() {
      return this.$store.getters.profiles
    },
  },
  methods: {
    removeFilter(filter) {
      const index = this.filters.indexOf(filter)
      if (index != null) {
        this.filters.splice(index, 1)
        this.onChange()
      }
    },
    closePresetModal() {
      this.showPresetModal = false
    },
    appendFilters() {
      for (const filter of this.selectedProfile.filters) {
        this.filters.push(filter)
      }
      this.onChange()
      this.$bvToast.toast(`The filters from the "${this.selectedProfile.name}" profile were appended`, { title: 'Success' })
    },
    applyProfile() {
      this.$store.commit('applyProfile', { videoId: this.videoId, feedName: this.feedName, profileKey: this.selectedProfile.key })
      this.$bvToast.toast(`Profile "${this.selectedProfile.name}" was applied to current video`, { title: 'Success' })
    },
    addFilter() {
      this.filters.push({
        type: null,
        value: null,
        caseSensitive: false,
      })
      this.onChange()
    },
    onChange() {
      this.$emit('change', this.filters)
    },
    exportFilters() {
      if (copy(JSON.stringify(this.filters))) {
        this.$bvToast.toast(`Filters were copied to your clipboard`, { title: 'Success' })
      } else {
        this.$bvToast.toast(`Impossible to copy the filters to your clipboard. This may be an issue with you browser.`, { title: 'Error' })
      }
    },

    importFilters(e) {
      try {
        const parsed = JSON.parse(this.importFilterTextArea)
        parsed.map(filterMigrate).forEach(f => this.filters.push(f))
        this.importFilterTextArea = ''
        this.onChange()
      } catch (e) {
        this.$bvToast.toast(`There was a problem when importing filters. Please check you export.`, { title: 'Error' })
        e.preventDefault()
      }
    },
    openPresetModal() {
      this.showPresetModal = true
    },
  },
}
</script>

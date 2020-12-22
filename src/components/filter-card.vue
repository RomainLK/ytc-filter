<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Filters</h5>
      <help-alert alert-key="filterHelp">
        Here you can configure filters which will capture messages from Youtube Livechat, based on a condition. A filter has a type, and some of them may also accept a value.
        Filters are updated in real time. There is no need to save. Note that filters are saved per video. If you wish to have them automatically applied for a channel or globally,
        create and use a profile.
      </help-alert>
      <button class="btn btn-primary mb-3" @click="addFilter">
        Add filter
      </button>
      <div class="pb-2" v-for="(filter, index) in filters" :key="'f' + index">
        <filter-condition :filter="filter" @delete="removeFilter" @change="onChange" />
      </div>
    </div>
  </div>
</template>
<script>
import filterCondition from '@/components/filter-condition'
import helpAlert from '@/components/help-alert'

export default {
  components: {
    filterCondition,
    helpAlert,
  },
  props: {
    filters: {
      type: Array,
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
  },
}
</script>

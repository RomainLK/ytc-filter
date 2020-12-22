<template>
  <div class="form-inline">
    <label class="mr-2">Filter type:</label>
    <select class="form-control mr-2" v-model="filter.type" @change="onChange">
      <option :value="null" disabled>Select</option
      ><option value="msgIncludes">Message includes</option>
      <option value="author">Author name is</option>
      <option value="isMember">Author is member</option>
      <option value="isModerator">Author is moderator</option>
      <option value="isOwner">Author is owner</option>
      <option value="isVerified">Author is verified</option>
      <option value="isSuperChat">Message is Super Chat</option>
      <option value="regex">Regex</option>
    </select>
    <input type="text" class="form-control mr-2" v-show="filterHasValue" v-model="filter.value" @input="onChange" />
    <label class="mr-2" v-show="filterHasCaseSensitive">Case sensitive:</label>
    <input class="mr-2" type="checkbox" v-show="filterHasCaseSensitive" v-model="filter.caseSensitive" @change="onChange" />
    <div class="float-right">
      <button class="btn btn-danger" @click="$emit('delete', filter)">X</button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    filter: {
      type: Object,
    },
  },
  computed: {
    filterHasValue() {
      return ['msgIncludes', 'author', 'regex'].includes(this.filter.type)
    },
    filterHasCaseSensitive() {
      return ['author', 'msgIncludes'].includes(this.filterType)
    },
  },
  // watch: {
  //   filter: {
  //     handler: 'onChange',
  //     deep: true,
  //   },
  // },
  methods: {
    onChange() {
      this.$emit('change', this.filter)
    },
  },
}
</script>

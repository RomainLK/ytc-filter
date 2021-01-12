<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Embedded ytcFilter options</h5>
      <b-form-checkbox v-model="options.autoOpen" @change="onChange">
        Auto open embedded ytcFilter
      </b-form-checkbox>
      <b-form-checkbox v-model="options.autoScroll" @change="onChange">
        Auto scroll ytcFilter's message feed
      </b-form-checkbox>
      <b-form-checkbox v-model="options.autoMaxHeight" @change="onChange">
        Automatically maximize ytcFilter's height
      </b-form-checkbox>

      <label for="range-2">Custom height: {{ options.height }}px</label>
      <b-form-input type="range" id="height-opt" class="width" min="50" :max="800" :disabled="this.options.autoMaxHeight" v-model="options.height" step="1" @change="onChange" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          autoOpen: false,
          autoScroll: true,
          height: 100,
          autoMaxHeight: false,
        }
      },
    },
  },
  methods: {
    onChange() {
      this.$emit('change', this.options)
    },
  },
}
</script>

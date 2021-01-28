module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/no-babel',
  transform: {
    '^.+\\.txt$': 'jest-text-transformer',
  },
}

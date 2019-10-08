module.exports = function(api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {
        plugins: ['ignite-ignore-reactotron', 'transform-remove-console']
      }
    }
  }
}

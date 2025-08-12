try {
  const plugin = require('./plugin/build/withVolumeKeyIntercept');
  module.exports = plugin.default || plugin;
} catch (error) {
  console.error('Failed to load react-native-kookit plugin:', error.message);
  // Return a no-op plugin as fallback
  module.exports = (config) => config;
}

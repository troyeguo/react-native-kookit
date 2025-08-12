try {
  const { default: withVolumeKeyIntercept } = require('./plugin/build/withVolumeKeyIntercept');
  module.exports = withVolumeKeyIntercept;
} catch (error) {
  console.warn('Failed to load react-native-kookit plugin:', error.message);
  // Return a no-op plugin as fallback
  module.exports = (config) => config;
}

#!/bin/bash

echo "🔧 Building React Native Kookit Module..."

# Build the module
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Module built successfully!"
    echo ""
    echo "📱 To test volume key interception:"
    echo "1. Make sure your MainActivity implements VolumeKeyInterceptActivity (see VOLUME_KEYS.md)"
    echo "2. Run the example app: cd example && npm run android"
    echo "3. Enable volume interception in the app"
    echo "4. Press physical volume keys to test"
    echo ""
    echo "📋 Expected behavior:"
    echo "- Volume HUD should NOT appear"
    echo "- System volume should NOT change"
    echo "- App should show alert with 'up' or 'down' key events"
    echo ""
    echo "📖 See VOLUME_KEYS.md for detailed implementation guide"
else
    echo "❌ Build failed. Please check errors above."
fi

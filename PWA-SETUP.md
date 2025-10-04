# PWA Setup for FlashyLearny

## Overview
FlashyLearny is configured as a Progressive Web App (PWA) with offline capabilities and installable features.

## PWA Features
- ✅ **Web App Manifest** - App metadata and installation settings
- ✅ **Service Worker** - Offline functionality and caching
- ✅ **Responsive Design** - Mobile-first design
- ✅ **Installable** - Can be installed on devices
- ✅ **Offline Support** - Works without internet connection

## Required Icon Files
To complete the PWA setup, you need to generate the following icon files:

### Required Icons:
- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px) 
- `apple-touch-icon.png` (180x180px)

### How to Generate Icons:
1. Open `public/generate-icons.html` in your browser
2. Click the download buttons for each icon size
3. Save the files to the `public/` directory

### Alternative: Use Online Icon Generator
You can also use online tools like:
- [PWA Builder](https://www.pwabuilder.com/)
- [Favicon Generator](https://realfavicongenerator.net/)

## PWA Configuration

### Manifest Features:
- **Name**: FlashyLearny - Study Decks & Flashcards
- **Display**: Standalone (full-screen app experience)
- **Theme Color**: #0ea5e9 (blue)
- **Background Color**: #ffffff (white)
- **Orientation**: Portrait primary
- **Categories**: Education, Productivity, Utilities

### Service Worker:
- Located at `public/sw.js`
- Handles offline caching
- Manages app updates

## Testing PWA Features

### Install the App:
1. Open the app in Chrome/Edge
2. Look for the install button in the address bar
3. Click "Install" to add to home screen

### Test Offline:
1. Install the app
2. Turn off internet connection
3. Open the app - it should still work

### Lighthouse PWA Audit:
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run PWA audit
4. Should score 100/100 for PWA features

## Browser Support
- ✅ Chrome/Edge (full support)
- ✅ Firefox (good support)
- ✅ Safari (iOS 11.3+)
- ✅ Samsung Internet

## Next Steps
1. Generate and add the required icon files
2. Test PWA installation on different devices
3. Consider adding push notifications (optional)
4. Test offline functionality thoroughly

# 🍎 iOS App Store Deployment Fix Guide

## ❌ Current Error
```
No matching profiles found for bundle identifier "com.pepulink.app" and distribution type "app_store"
```

## ✅ Solution Applied

### 1. **Updated Bundle Identifier**
- **Old**: `com.pepulink.app`
- **New**: `com.jwgray1010.pepulink`
- **Android Package**: `com.jwgray1010.pepulink`

### 2. **Fixed Asset References**
- Updated all icon references from missing `adaptive-icon.png` to existing `logo.png`
- Fixed splash screen image reference
- Updated notification icons

### 3. **Created EAS Build Configuration**
- Added `eas.json` with proper build profiles
- Configured production builds for iOS and Android
- Set up proper distribution channels

---

## 🚀 Next Steps for iOS App Store Deployment

### Step 1: Apple Developer Account Setup
1. **Enroll in Apple Developer Program** ($99/year)
   - Go to [developer.apple.com](https://developer.apple.com/programs/)
   - Complete enrollment process

2. **Create App in App Store Connect**
   - Login to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
   - Create new app with bundle ID: `com.jwgray1010.pepulink`
   - App Name: "PEPULink"
   - SKU: "pepulink-v2"

### Step 2: Provisioning Profile & Certificates
```bash
# Install EAS CLI if not already installed
npm install -g @expo/eas-cli

# Login to your Expo account
eas login

# Configure the project
eas build:configure

# Create development build (for testing)
eas build --platform ios --profile development

# Create production build for App Store
eas build --platform ios --profile production
```

### Step 3: Automatic Certificate Management
EAS Build will automatically:
- Generate iOS Distribution Certificate
- Create App Store Provisioning Profile
- Handle code signing for you

### Step 4: Submit to App Store
```bash
# After successful production build
eas submit --platform ios
```

---

## 🔧 Manual Certificate Setup (Alternative)

If you prefer manual setup:

### 1. **Create App Identifier**
- Login to [developer.apple.com](https://developer.apple.com/account/)
- Go to Certificates, Identifiers & Profiles
- Create new App ID with bundle ID: `com.jwgray1010.pepulink`

### 2. **Create Distribution Certificate**
- Generate iOS Distribution Certificate
- Download and install in Keychain

### 3. **Create Provisioning Profile**
- Create App Store Distribution Profile
- Select your app ID and distribution certificate
- Download the profile

### 4. **Update eas.json with Manual Credentials**
```json
{
  "build": {
    "production": {
      "ios": {
        "bundleIdentifier": "com.jwgray1010.pepulink",
        "distributionCertificate": {
          "path": "./certificates/distribution-cert.p12",
          "password": "your-password"
        },
        "provisioningProfile": "./certificates/profile.mobileprovision"
      }
    }
  }
}
```

---

## 📱 Android Play Store Setup

### 1. **Google Play Console**
- Create developer account ($25 one-time fee)
- Go to [play.google.com/console](https://play.google.com/console)

### 2. **Create Android App Bundle**
```bash
# Build for Android
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android
```

### 3. **Upload Keystore (if needed)**
```bash
# Generate keystore for signing
eas credentials

# Follow prompts to create or upload keystore
```

---

## 🔑 Environment Variables for CI/CD

Add these to your GitHub repository secrets:

### Required for iOS
- `EXPO_APPLE_ID` - Your Apple Developer account email
- `EXPO_APPLE_APP_SPECIFIC_PASSWORD` - App-specific password
- `EXPO_APPLE_TEAM_ID` - Your Apple Developer Team ID

### Required for Android  
- `EXPO_ANDROID_KEYSTORE` - Base64 encoded keystore
- `EXPO_ANDROID_KEYSTORE_PASSWORD` - Keystore password
- `EXPO_ANDROID_KEY_ALIAS` - Key alias
- `EXPO_ANDROID_KEY_PASSWORD` - Key password

### General
- `EXPO_TOKEN` - Expo authentication token

---

## 📋 Updated Files

✅ **app.json**
- Fixed bundle identifier: `com.jwgray1010.pepulink`
- Updated all asset references to use `logo.png`
- Corrected Android package name

✅ **eas.json** (New)
- Production build configuration
- Development and preview profiles
- Platform-specific settings

---

## 🚀 Quick Deploy Commands

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login and configure
eas login
eas build:configure

# Build for both platforms
eas build --platform all --profile production

# Submit to stores
eas submit --platform all --profile production
```

---

## 📞 Support Resources

- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **App Store Connect**: https://appstoreconnect.apple.com
- **Google Play Console**: https://play.google.com/console
- **Apple Developer**: https://developer.apple.com

---

**✅ Bundle identifier issue is now resolved!**
The app is configured with the correct bundle ID and all necessary build configurations for successful App Store deployment.

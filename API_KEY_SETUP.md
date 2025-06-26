# 🔐 API Key Security Setup Guide

## Overview
This guide shows you how to securely configure your API key for both development and production environments in your PEPULink app.

## ⚠️ IMPORTANT SECURITY NOTES
- **NEVER** commit your actual API key to version control
- Always use environment variables for sensitive data
- Use different API keys for development and production
- Rotate your API keys regularly

## 1. Local Development Setup

### Step 1: Create Local .env File
```bash
# In your project root, create .env file
cp .env.example .env
```

### Step 2: Add Your API Key to .env
```bash
# Edit .env file with your actual values
EXPO_PUBLIC_API_KEY=your_actual_api_key_here
EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
EXPO_PUBLIC_PEPU_TOKEN_ADDRESS=your_token_contract_address
```

### Step 3: Verify Configuration
```bash
# Start development server
npx expo start

# Check that environment variables are loaded
console.log('API Key loaded:', !!process.env.EXPO_PUBLIC_API_KEY);
```

## 2. GitHub Secrets Setup

### Step 1: Navigate to Repository Settings
1. Go to your GitHub repository
2. Click "Settings" tab
3. Click "Secrets and variables" → "Actions"

### Step 2: Add Repository Secrets
Add these secrets (click "New repository secret"):

```
Name: PEPU_API_KEY
Value: [YOUR_ACTUAL_API_KEY]

Name: PEPU_TOKEN_ADDRESS  
Value: [YOUR_TOKEN_CONTRACT_ADDRESS]

Name: WALLETCONNECT_PROJECT_ID
Value: [YOUR_WALLETCONNECT_PROJECT_ID]
```

### Step 3: Optional Additional Secrets
```
Name: ALCHEMY_API_KEY
Value: [YOUR_ALCHEMY_KEY] (if using Alchemy)

Name: INFURA_PROJECT_ID
Value: [YOUR_INFURA_ID] (if using Infura)
```

## 3. Codemagic Environment Setup

### Step 1: Access Codemagic Dashboard
1. Log into your Codemagic account
2. Select your LinkLayer project
3. Go to "Environment variables"

### Step 2: Add Environment Variables
Add these as **secure** environment variables:

```
PEPU_API_KEY = [YOUR_API_KEY]
PEPU_TOKEN_ADDRESS = [YOUR_TOKEN_ADDRESS]
WALLETCONNECT_PROJECT_ID = [YOUR_WALLETCONNECT_ID]
```

### Step 3: Update Group Variables
- Click "Add to group" for each variable
- Create a group named "production_secrets"
- Reference this group in your workflows

## 4. API Key Validation

### Test API Key Locally
Create a test file to verify your API key works:

```javascript
// test-api.js
import ApiService from './src/services/ApiService';

async function testApi() {
  try {
    // Test a simple API call
    const result = await ApiService.request('/health');
    console.log('API Key valid:', result);
  } catch (error) {
    console.error('API Key invalid:', error.message);
  }
}

testApi();
```

Run the test:
```bash
node test-api.js
```

## 5. Production Deployment Checklist

### Before Deploying:
- [ ] API key added to GitHub Secrets
- [ ] API key added to Codemagic environment
- [ ] Token contract address verified
- [ ] WalletConnect project ID configured
- [ ] Local .env file created (not committed)
- [ ] All environment variables tested

### Security Best Practices:
- [ ] Use different API keys for dev/staging/production
- [ ] Enable API key restrictions (IP whitelist if possible)
- [ ] Monitor API key usage for unusual activity
- [ ] Set up alerts for API rate limit breaches
- [ ] Regularly rotate API keys (quarterly)

## 6. Troubleshooting

### Common Issues:

**API Key Not Loading:**
```bash
# Check if .env file exists
ls -la .env

# Verify environment variables
npx expo config

# Restart development server
npx expo start --clear
```

**Build Failures:**
- Ensure secrets are added to GitHub repository
- Check Codemagic environment variables
- Verify variable names match exactly

**Runtime Errors:**
- Check API key format (no extra spaces/quotes)
- Verify API endpoint URLs
- Test API key with curl/Postman first

### Debug Commands:
```bash
# Check loaded environment variables
npx expo config --type introspect

# Test API connectivity
curl -H "X-API-Key: YOUR_API_KEY" https://api.linklayer.app/health

# View build logs
codemagic builds logs [BUILD_ID]
```

## 7. API Key Rotation Process

### Monthly Rotation (Recommended):
1. Generate new API key from provider
2. Update GitHub Secrets
3. Update Codemagic environment
4. Update local .env file
5. Test all environments
6. Revoke old API key
7. Update documentation

## 8. Security Monitoring

### Set Up Alerts:
- API usage spikes
- Failed authentication attempts  
- Rate limit violations
- Unusual geographic access

### Log Monitoring:
```javascript
// Add to your ApiService
logApiUsage(endpoint, status, responseTime) {
  console.log('API Call:', {
    endpoint,
    status,
    responseTime,
    timestamp: new Date().toISOString(),
    sessionId: this.sessionId
  });
}
```

## 9. Emergency Response

### If API Key Compromised:
1. **Immediately** revoke the compromised key
2. Generate new API key
3. Update all environments (GitHub, Codemagic, local)
4. Force new app builds
5. Monitor for unusual activity
6. Consider rotating related credentials

### Contact Information:
- **API Provider Support:** support@linklayer.app
- **Emergency Security:** security@linklayer.app
- **Documentation:** https://docs.linklayer.app

---

## ✅ Quick Setup Summary

For immediate setup, run these commands:

```bash
# 1. Setup local environment
cp .env.example .env
# Edit .env with your actual API key

# 2. Add to GitHub Secrets:
# PEPU_API_KEY = [your_key]
# PEPU_TOKEN_ADDRESS = [your_address]  
# WALLETCONNECT_PROJECT_ID = [your_id]

# 3. Add to Codemagic environment variables
# (Same keys as above)

# 4. Test the setup
npx expo start
```

Your app is now configured with secure API key management! 🚀

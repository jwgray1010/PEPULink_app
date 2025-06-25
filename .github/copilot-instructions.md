<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# LinkLayer Expo App - Copilot Instructions

This is a React Native Expo project for the LinkLayer payment platform with the following key features:

## Project Architecture
- **Framework**: React Native with Expo SDK
- **Wallet Integration**: RainbowKit + Wagmi for Web3 connectivity
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **State Management**: React hooks and context
- **Charts**: Victory Native for data visualization
- **QR Codes**: Expo Camera + Barcode Scanner
- **Styling**: React Native StyleSheet with custom themes

## Key Features
1. **Web3 Wallet Connection**: Custom LinkLayer chain (ID: 97741) + Ethereum mainnet
2. **Payment System**: QR code scanning, merchant payments, card management
3. **AI Smart Spending**: AI-powered spending analysis and recommendations
4. **Analytics Dashboard**: Professional charts and financial insights
5. **User Experience**: Onboarding tours, splash screens, floating messages

## Development Guidelines
- Use TypeScript for type safety where possible
- Follow React Native best practices for performance
- Implement proper error handling for Web3 transactions
- Use Expo-compatible libraries only
- Maintain consistent UI/UX patterns across screens
- Test on both iOS and Android platforms

## Codemagic CI/CD
- Project is configured for Codemagic build automation
- Supports both iOS and Android builds
- Environment variables for WalletConnect and API keys
- Automated testing and deployment workflows

## Custom Chain Configuration
```javascript
const linkLayerChain = {
  id: 97741,
  name: 'LinkLayer V2',
  rpcUrls: {
    default: { http: ['https://rpc-linklayer-v2-mainnet-0.t.conduit.xyz'] }
  }
}
```

When generating code, prioritize mobile-first design, accessibility, and smooth animations.

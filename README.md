# LinkLayer - Advanced Web3 Payment Platform

A React Native Expo application for the LinkLayer payment platform, featuring wallet connectivity, QR code payments, and AI-powered spending analytics.

## Features

### 🔗 Web3 Wallet Integration
- **RainbowKit + Wagmi**: Seamless wallet connectivity
- **Custom LinkLayer Chain**: Native support for LinkLayer V2 (Chain ID: 97741)
- **Multi-chain Support**: Ethereum mainnet compatibility
- **Secure Transactions**: End-to-end encrypted payment processing

### 📱 Payment System
- **QR Code Scanning**: Fast merchant payment processing
- **Card Management**: Digital wallet card with real-time balance
- **Transaction History**: Complete payment tracking and analytics
- **Top-up Integration**: Easy balance management

### 🤖 AI Smart Spending
- **Spending Analysis**: AI-powered insights and recommendations
- **Category Tracking**: Automatic expense categorization
- **Budget Alerts**: Intelligent spending limit notifications
- **Predictive Analytics**: Future spending pattern analysis

### 📊 Analytics Dashboard
- **Victory Native Charts**: Professional data visualization
- **Real-time Insights**: Live spending trends and statistics
- **Category Breakdown**: Detailed expense analysis
- **Custom Reports**: Personalized financial insights

## Tech Stack

- **Framework**: React Native with Expo SDK 51+
- **Navigation**: React Navigation v6 (Bottom Tabs + Stack)
- **Web3**: RainbowKit v2.2+ + Wagmi v2.15+
- **Charts**: Victory Native for data visualization
- **Camera**: Expo Camera + Barcode Scanner for QR codes
- **UI**: React Native Elements + Custom styled components
- **State**: React hooks and context API

## Getting Started

### Prerequisites
- Node.js 18.17.0 or higher
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone and setup**:
   ```bash
   git clone https://github.com/yourusername/linklayer-app.git
   cd linklayer-app
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Start Development Server**:
   ```bash
   npx expo start
   ```

4. **Run on Device**:
   - **iOS**: Press `i` in terminal or scan QR with Expo Go
   - **Android**: Press `a` in terminal or scan QR with Expo Go
   - **Web**: Press `w` in terminal

### Environment Variables

Create a `.env` file with the following variables:

```env
# WalletConnect Project ID (required)
EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# LinkLayer Chain Configuration
EXPO_PUBLIC_LINKLAYER_RPC_URL=https://rpc-linklayer-v2-mainnet-0.t.conduit.xyz
EXPO_PUBLIC_LINKLAYER_CHAIN_ID=97741

# Optional API Keys
EXPO_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
EXPO_PUBLIC_INFURA_PROJECT_ID=your_infura_id
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── SplashScreen.js
│   └── ...
├── screens/            # Main application screens
│   ├── HomeScreen.js
│   ├── QRScannerScreen.js
│   ├── HistoryScreen.js
│   ├── AnalyticsScreen.js
│   └── ProfileScreen.js
├── config/             # Configuration files
└── assets/             # Images, fonts, etc.
```

## Key Components

### Chain Configuration
```javascript
const linkLayerChain = {
  id: 97741,
  name: 'LinkLayer V2',
  rpcUrls: {
    default: { http: ['https://rpc-linklayer-v2-mainnet-0.t.conduit.xyz'] }
  }
}
```

### Wallet Integration
```javascript
const config = getDefaultConfig({
  appName: 'LinkLayer',
  chains: [mainnet, linkLayerChain],
  projectId: process.env.EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID,
});
```

## Building for Production

### Codemagic CI/CD

This project is configured for Codemagic automated builds:

1. **Connect Repository**: Link your GitHub repo to Codemagic
2. **Environment Variables**: Set required env vars in Codemagic dashboard
3. **Build Configuration**: Uses `codemagic.yaml` for build settings
4. **Deployment**: Automatic builds for both iOS and Android

### Manual Build

```bash
# Android
npx expo build:android

# iOS
npx expo build:ios
```

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React Native best practices
- Implement proper error boundaries
- Use TypeScript where beneficial

### Testing
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

### Performance
- Optimize images and assets
- Use lazy loading for large lists
- Implement proper memoization
- Monitor bundle size

## Security

- **Private Keys**: Never commit private keys or sensitive data
- **Environment Variables**: Use `.env` for configuration
- **API Keys**: Rotate keys regularly
- **Wallet Security**: Implement proper wallet connection validation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

### Codemagic Workflow
- **Automatic Builds**: On push to main branch
- **Environment Management**: Secure env var handling
- **Multi-platform**: iOS and Android builds
- **App Store Integration**: Automated publishing pipeline

### Manual Deployment
1. Build production bundles
2. Upload to respective app stores
3. Configure store listings
4. Submit for review

## Support

- **Documentation**: Check inline code comments
- **Issues**: GitHub Issues for bug reports
- **Discord**: Join our developer community
- **Email**: support@linklayer.com

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **RainbowKit Team**: For excellent wallet integration
- **Expo Team**: For the amazing development platform
- **Victory**: For powerful charting capabilities
- **React Native Community**: For continuous innovation

---

**LinkLayer** - Empowering the future of Web3 payments 🚀

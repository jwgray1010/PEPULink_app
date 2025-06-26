// Pepe Unchained V2 Chain Configuration
export const pepuChain = {
  id: 97741,
  name: 'Pepe Unchained V2',
  network: 'pepu-v2',
  nativeCurrency: {
    decimals: 18,
    name: 'PEPU',
    symbol: 'PEPU',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-pepu-v2-mainnet-0.t.conduit.xyz'],
    },
    public: {
      http: ['https://rpc-pepu-v2-mainnet-0.t.conduit.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Pepe Unchained Explorer',
      url: 'https://explorer-pepu-v2-mainnet-0.t.conduit.xyz',
    },
  },
  testnet: false,
};

// Ethereum Mainnet Configuration
export const ethereumMainnet = {
  id: 1,
  name: 'Ethereum',
  network: 'homestead',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://cloudflare-eth.com'],
    },
    public: {
      http: ['https://cloudflare-eth.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
    },
  },
  testnet: false,
};

// Supported Chains
export const supportedChains = [pepuChain, ethereumMainnet];

// Chain-specific configurations
export const chainConfigs = {
  [pepuChain.id]: {
    name: 'Pepe Unchained V2',
    logo: '�',
    color: '#4ECDC4',
    features: ['fast-transactions', 'low-fees', 'ai-insights', 'defi-trading'],
    contractAddresses: {
      paymentProcessor: '0x919d918E23456ed8472AfBf17984f8f458661bCF',
      pepuToken: '0xdb0976d5edc9bd329d354dabdeae00e4de11c941',
      wpepuToken: '0xf9cf4a16d26979b929be7176bac4e7084975fcb8',
      pepuPool: '0x3a614c79a17b18819ba6b97e330b61ba8fe34435',
      tokenRegistry: '0x...',
      rewardsContract: '0x...',
    },
  },
  [ethereumMainnet.id]: {
    name: 'Ethereum',
    logo: '⟠',
    color: '#627EEA',
    features: ['defi', 'nfts', 'wide-adoption'],
    contractAddresses: {
      uniswapRouter: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    },
  },
};

// Default chain
export const defaultChain = pepuChain;

// WalletConnect configuration
export const walletConnectConfig = {
  projectId: process.env.EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  metadata: {
    name: 'PEPULink',
    description: 'Advanced PEPU Payment Platform',
    url: 'https://pepulink.app',
    icons: ['https://pepulink.app/icon.png'],
  },
  allowUnsupportedChain: false,
};

// App constants
export const APP_CONFIG = {
  name: process.env.EXPO_PUBLIC_APP_NAME || 'PEPULink',
  version: process.env.EXPO_PUBLIC_APP_VERSION || '2.0.0',
  build: 1,
  environment: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.pepulink.app',
  apiKey: process.env.EXPO_PUBLIC_API_KEY || '',
  websocketUrl: process.env.EXPO_PUBLIC_WS_URL || 'wss://ws.pepulink.app',
  supportEmail: 'support@pepulink.app',
  features: {
    aiAssistant: true,
    professionalAnalytics: true,
    merchantQR: true,
    multiCard: true,
    realTimeNotifications: true,
    biometricAuth: true,
    defiTrading: true,
  },
};

// Payment configurations
export const PAYMENT_CONFIG = {
  supportedCurrencies: ['USD', 'EUR', 'GBP', 'ETH', 'LINK'],
  defaultCurrency: 'USD',
  maxTransactionAmount: 10000,
  minTransactionAmount: 0.01,
  feeStructure: {
    domestic: 0.029, // 2.9%
    international: 0.039, // 3.9%
    crypto: 0.015, // 1.5%
  },
  qrCodeExpiry: 24 * 60 * 60 * 1000, // 24 hours
};

// Analytics configurations
export const ANALYTICS_CONFIG = {
  trackingEnabled: true,
  events: {
    payment: 'payment_completed',
    qrScan: 'qr_code_scanned',
    cardAdded: 'card_added',
    aiInsight: 'ai_insight_viewed',
  },
  providers: {
    mixpanel: process.env.EXPO_PUBLIC_MIXPANEL_TOKEN,
    amplitude: process.env.EXPO_PUBLIC_AMPLITUDE_KEY,
  },
};

// Security configurations
export const SECURITY_CONFIG = {
  biometricAuth: true,
  pinRequired: true,
  sessionTimeout: 15 * 60 * 1000, // 15 minutes
  maxFailedAttempts: 3,
  encryptionEnabled: true,
  autoLockEnabled: true,
};

// UI/UX configurations
export const UI_CONFIG = {
  theme: {
    primary: '#4ECDC4',
    secondary: '#45B7D1',
    accent: '#96CEB4',
    warning: '#FFEAA7',
    error: '#FF6B6B',
    success: '#4ECDC4',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
  },
  animations: {
    duration: 300,
    easing: 'ease-in-out',
  },
  haptics: true,
  soundEffects: true,
};

// Feature flags
export const FEATURE_FLAGS = {
  newAnalyticsDashboard: true,
  aiChatV2: true,
  merchantQRGenerator: true,
  multiWalletSupport: true,
  socialPayments: false,
  cryptoStaking: false,
  nftSupport: false,
};

// API endpoints
export const API_ENDPOINTS = {
  auth: '/auth',
  wallet: '/wallet',
  transactions: '/transactions',
  analytics: '/analytics',
  cards: '/cards',
  qr: '/qr',
  ai: '/ai',
  merchants: '/merchants',
};

// Error messages
export const ERROR_MESSAGES = {
  WALLET_CONNECTION_FAILED: 'Failed to connect wallet. Please try again.',
  TRANSACTION_FAILED: 'Transaction failed. Please check your balance and try again.',
  QR_SCAN_FAILED: 'Failed to scan QR code. Please ensure good lighting and try again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  INVALID_AMOUNT: 'Please enter a valid amount.',
  INSUFFICIENT_FUNDS: 'Insufficient funds for this transaction.',
  CARD_FROZEN: 'This card is currently frozen. Please unfreeze it to continue.',
  DAILY_LIMIT_EXCEEDED: 'Daily spending limit exceeded.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet connected successfully!',
  TRANSACTION_COMPLETED: 'Transaction completed successfully!',
  CARD_ADDED: 'Card added successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
  QR_GENERATED: 'QR code generated successfully!',
  PAYMENT_RECEIVED: 'Payment received successfully!',
};

// Import token configuration
export { TOKEN_CONFIG, TOKEN_ADDRESSES, SUPPORTED_TOKENS, TokenUtils, LIQUIDITY_POOLS, TRADING_PAIRS } from './tokens.js';

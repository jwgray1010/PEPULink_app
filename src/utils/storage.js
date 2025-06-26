/**
 * Storage utilities for the LinkLayer app using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: '@linkLayer:userPreferences',
  WALLET_CONNECTIONS: '@linkLayer:walletConnections',
  TRANSACTION_HISTORY: '@linkLayer:transactionHistory',
  CARDS_DATA: '@linkLayer:cardsData',
  AI_INSIGHTS: '@linkLayer:aiInsights',
  ONBOARDING_COMPLETED: '@linkLayer:onboardingCompleted',
  BIOMETRIC_ENABLED: '@linkLayer:biometricEnabled',
  PIN_HASH: '@linkLayer:pinHash',
  APP_SETTINGS: '@linkLayer:appSettings',
  MERCHANT_DATA: '@linkLayer:merchantData',
  QR_HISTORY: '@linkLayer:qrHistory',
  SPENDING_LIMITS: '@linkLayer:spendingLimits',
  NOTIFICATION_SETTINGS: '@linkLayer:notificationSettings',
};

// Generic storage functions
export const setItem = async (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, serializedValue);
    return { success: true };
  } catch (error) {
    console.error('Error storing data:', error);
    return { success: false, error: error.message };
  }
};

export const getItem = async (key, defaultValue = null) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return defaultValue;
  }
};

export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return { success: true };
  } catch (error) {
    console.error('Error removing data:', error);
    return { success: false, error: error.message };
  }
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    return { success: true };
  } catch (error) {
    console.error('Error clearing storage:', error);
    return { success: false, error: error.message };
  }
};

// User preferences
export const getUserPreferences = () => {
  return getItem(STORAGE_KEYS.USER_PREFERENCES, {
    theme: 'light',
    currency: 'USD',
    language: 'en',
    notifications: true,
    haptics: true,
    soundEffects: true,
    biometricAuth: false,
    autoLock: true,
    lockTimeout: 300000, // 5 minutes
  });
};

export const setUserPreferences = (preferences) => {
  return setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
};

// Wallet connections
export const getWalletConnections = () => {
  return getItem(STORAGE_KEYS.WALLET_CONNECTIONS, []);
};

export const setWalletConnections = (connections) => {
  return setItem(STORAGE_KEYS.WALLET_CONNECTIONS, connections);
};

export const addWalletConnection = async (connection) => {
  const connections = await getWalletConnections();
  const existingIndex = connections.findIndex(c => c.address === connection.address);
  
  if (existingIndex >= 0) {
    connections[existingIndex] = { ...connections[existingIndex], ...connection };
  } else {
    connections.push({
      ...connection,
      connectedAt: Date.now(),
    });
  }
  
  return setWalletConnections(connections);
};

export const removeWalletConnection = async (address) => {
  const connections = await getWalletConnections();
  const filteredConnections = connections.filter(c => c.address !== address);
  return setWalletConnections(filteredConnections);
};

// Transaction history
export const getTransactionHistory = () => {
  return getItem(STORAGE_KEYS.TRANSACTION_HISTORY, []);
};

export const setTransactionHistory = (transactions) => {
  return setItem(STORAGE_KEYS.TRANSACTION_HISTORY, transactions);
};

export const addTransaction = async (transaction) => {
  const transactions = await getTransactionHistory();
  const newTransaction = {
    ...transaction,
    id: transaction.id || `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: transaction.timestamp || Date.now(),
  };
  
  transactions.unshift(newTransaction); // Add to beginning
  
  // Keep only last 1000 transactions
  if (transactions.length > 1000) {
    transactions.splice(1000);
  }
  
  return setTransactionHistory(transactions);
};

// Cards data
export const getCardsData = () => {
  return getItem(STORAGE_KEYS.CARDS_DATA, []);
};

export const setCardsData = (cards) => {
  return setItem(STORAGE_KEYS.CARDS_DATA, cards);
};

export const addCard = async (card) => {
  const cards = await getCardsData();
  const newCard = {
    ...card,
    id: card.id || `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
  };
  
  cards.push(newCard);
  return setCardsData(cards);
};

export const updateCard = async (cardId, updates) => {
  const cards = await getCardsData();
  const cardIndex = cards.findIndex(c => c.id === cardId);
  
  if (cardIndex >= 0) {
    cards[cardIndex] = { ...cards[cardIndex], ...updates, updatedAt: Date.now() };
    return setCardsData(cards);
  }
  
  return { success: false, error: 'Card not found' };
};

export const removeCard = async (cardId) => {
  const cards = await getCardsData();
  const filteredCards = cards.filter(c => c.id !== cardId);
  return setCardsData(filteredCards);
};

// AI insights
export const getAIInsights = () => {
  return getItem(STORAGE_KEYS.AI_INSIGHTS, []);
};

export const setAIInsights = (insights) => {
  return setItem(STORAGE_KEYS.AI_INSIGHTS, insights);
};

export const addAIInsight = async (insight) => {
  const insights = await getAIInsights();
  const newInsight = {
    ...insight,
    id: insight.id || `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
  };
  
  insights.unshift(newInsight);
  
  // Keep only last 100 insights
  if (insights.length > 100) {
    insights.splice(100);
  }
  
  return setAIInsights(insights);
};

// Onboarding status
export const getOnboardingCompleted = () => {
  return getItem(STORAGE_KEYS.ONBOARDING_COMPLETED, false);
};

export const setOnboardingCompleted = (completed = true) => {
  return setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, completed);
};

// Biometric settings
export const getBiometricEnabled = () => {
  return getItem(STORAGE_KEYS.BIOMETRIC_ENABLED, false);
};

export const setBiometricEnabled = (enabled) => {
  return setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, enabled);
};

// PIN hash
export const getPINHash = () => {
  return getItem(STORAGE_KEYS.PIN_HASH, null);
};

export const setPINHash = (hash) => {
  return setItem(STORAGE_KEYS.PIN_HASH, hash);
};

// App settings
export const getAppSettings = () => {
  return getItem(STORAGE_KEYS.APP_SETTINGS, {
    analyticsEnabled: true,
    crashReportingEnabled: true,
    backgroundSyncEnabled: true,
    autoBackupEnabled: true,
    developerMode: false,
  });
};

export const setAppSettings = (settings) => {
  return setItem(STORAGE_KEYS.APP_SETTINGS, settings);
};

// Merchant data
export const getMerchantData = () => {
  return getItem(STORAGE_KEYS.MERCHANT_DATA, {
    businessName: '',
    businessId: '',
    businessType: '',
    contactInfo: {},
    paymentSettings: {},
  });
};

export const setMerchantData = (data) => {
  return setItem(STORAGE_KEYS.MERCHANT_DATA, data);
};

// QR history
export const getQRHistory = () => {
  return getItem(STORAGE_KEYS.QR_HISTORY, []);
};

export const setQRHistory = (history) => {
  return setItem(STORAGE_KEYS.QR_HISTORY, history);
};

export const addQRToHistory = async (qrData) => {
  const history = await getQRHistory();
  const newEntry = {
    ...qrData,
    id: `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    scannedAt: Date.now(),
  };
  
  history.unshift(newEntry);
  
  // Keep only last 50 QR codes
  if (history.length > 50) {
    history.splice(50);
  }
  
  return setQRHistory(history);
};

// Spending limits
export const getSpendingLimits = () => {
  return getItem(STORAGE_KEYS.SPENDING_LIMITS, {
    daily: 1000,
    weekly: 5000,
    monthly: 20000,
    perTransaction: 1000,
  });
};

export const setSpendingLimits = (limits) => {
  return setItem(STORAGE_KEYS.SPENDING_LIMITS, limits);
};

// Notification settings
export const getNotificationSettings = () => {
  return getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, {
    transactionAlerts: true,
    securityAlerts: true,
    marketingNotifications: false,
    weeklyReports: true,
    spendingAlerts: true,
    lowBalanceAlerts: true,
    cardExpiration: true,
  });
};

export const setNotificationSettings = (settings) => {
  return setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, settings);
};

// Bulk operations
export const exportUserData = async () => {
  try {
    const userData = {};
    
    for (const [key, storageKey] of Object.entries(STORAGE_KEYS)) {
      userData[key] = await getItem(storageKey);
    }
    
    return {
      success: true,
      data: {
        ...userData,
        exportedAt: Date.now(),
        version: '2.0.0',
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const importUserData = async (userData) => {
  try {
    for (const [key, value] of Object.entries(userData)) {
      if (STORAGE_KEYS[key] && value !== undefined) {
        await setItem(STORAGE_KEYS[key], value);
      }
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Clean old data
export const cleanOldData = async (daysToKeep = 90) => {
  try {
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    
    // Clean transaction history
    const transactions = await getTransactionHistory();
    const filteredTransactions = transactions.filter(
      tx => tx.timestamp > cutoffTime
    );
    await setTransactionHistory(filteredTransactions);
    
    // Clean AI insights
    const insights = await getAIInsights();
    const filteredInsights = insights.filter(
      insight => insight.timestamp > cutoffTime
    );
    await setAIInsights(filteredInsights);
    
    // Clean QR history
    const qrHistory = await getQRHistory();
    const filteredQRHistory = qrHistory.filter(
      qr => qr.scannedAt > cutoffTime
    );
    await setQRHistory(filteredQRHistory);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

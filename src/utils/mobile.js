import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { Platform, Alert } from 'react-native';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Haptic Feedback Utilities
export const hapticFeedback = {
  light: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },
  medium: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  },
  heavy: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  },
  success: () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  },
  warning: () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  },
  error: () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  },
  selection: () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  }
};

// Biometric Authentication
export const biometricAuth = {
  isAvailable: async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      return {
        isAvailable: compatible && enrolled,
        supportedTypes,
        biometryType: supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION) 
          ? 'FaceID' 
          : supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT) 
          ? 'TouchID' 
          : 'Biometric'
      };
    } catch (error) {
      console.error('Biometric check error:', error);
      return { isAvailable: false, supportedTypes: [], biometryType: null };
    }
  },

  authenticate: async (reason = 'Please authenticate to continue') => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: false,
      });
      
      if (result.success) {
        hapticFeedback.success();
        return { success: true, error: null };
      } else {
        hapticFeedback.error();
        return { success: false, error: result.error || 'Authentication failed' };
      }
    } catch (error) {
      hapticFeedback.error();
      return { success: false, error: error.message };
    }
  }
};

// Secure Storage Utilities
export const secureStorage = {
  setItem: async (key, value) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
        return true;
      }
      await SecureStore.setItemAsync(key, value);
      return true;
    } catch (error) {
      console.error('Secure storage set error:', error);
      return false;
    }
  },

  getItem: async (key) => {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Secure storage get error:', error);
      return null;
    }
  },

  removeItem: async (key) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
        return true;
      }
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (error) {
      console.error('Secure storage remove error:', error);
      return false;
    }
  }
};

// Push Notifications
export const pushNotifications = {
  requestPermissions: async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Notification permission error:', error);
      return false;
    }
  },

  scheduleTransactionNotification: async (type, amount, merchant) => {
    try {
      const hasPermission = await pushNotifications.requestPermissions();
      if (!hasPermission) return false;

      const title = type === 'payment' ? 'Payment Sent' : 'Payment Received';
      const body = `${type === 'payment' ? '-' : '+'}$${amount.toFixed(2)} ${type === 'payment' ? 'to' : 'from'} ${merchant}`;

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { type, amount, merchant },
          sound: true,
        },
        trigger: null, // Show immediately
      });

      return true;
    } catch (error) {
      console.error('Notification schedule error:', error);
      return false;
    }
  }
};

// Performance Optimization Utilities
export const performanceUtils = {
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  },

  memoize: (fn) => {
    const cache = new Map();
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
  }
};

// Device Info Utilities
export const deviceUtils = {
  isTablet: () => {
    if (Platform.OS === 'ios') {
      return Platform.isPad;
    }
    // For Android, we'll use screen dimensions as a heuristic
    const { height, width } = require('react-native').Dimensions.get('window');
    const aspectRatio = height / width;
    return Math.min(height, width) >= 600 && aspectRatio <= 1.6;
  },

  getPlatformStyle: (iosStyle, androidStyle, webStyle = {}) => {
    switch (Platform.OS) {
      case 'ios':
        return iosStyle;
      case 'android':
        return androidStyle;
      case 'web':
        return webStyle;
      default:
        return iosStyle;
    }
  }
};

export default {
  hapticFeedback,
  biometricAuth,
  secureStorage,
  pushNotifications,
  performanceUtils,
  deviceUtils
};

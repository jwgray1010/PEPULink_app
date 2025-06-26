import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import NotificationManager from './NotificationManager';

class SecurityService {
  constructor() {
    this.isAuthenticated = false;
    this.authLevel = 'none'; // none, pin, biometric
    this.sessionTimeout = 5 * 60 * 1000; // 5 minutes
    this.lastActivity = Date.now();
    this.securityEvents = [];
  }

  // Biometric Authentication
  async checkBiometricSupport() {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      return {
        hasHardware,
        isEnrolled,
        supportedTypes,
        available: hasHardware && isEnrolled,
      };
    } catch (error) {
      console.error('Failed to check biometric support:', error);
      return { available: false, hasHardware: false, isEnrolled: false, supportedTypes: [] };
    }
  }

  async authenticateWithBiometrics(reason = 'Authenticate to access your account') {
    try {
      const biometricInfo = await this.checkBiometricSupport();
      
      if (!biometricInfo.available) {
        throw new Error('Biometric authentication not available');
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: false,
      });

      if (result.success) {
        this.isAuthenticated = true;
        this.authLevel = 'biometric';
        this.updateLastActivity();
        await this.logSecurityEvent('biometric_auth_success', 'info');
        return { success: true };
      } else {
        await this.logSecurityEvent('biometric_auth_failed', 'warning', {
          error: result.error
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      await this.logSecurityEvent('biometric_auth_error', 'error', {
        error: error.message
      });
      return { success: false, error: error.message };
    }
  }

  // PIN Authentication
  async setPIN(pin) {
    try {
      if (!this.validatePIN(pin)) {
        throw new Error('PIN must be 4-6 digits');
      }

      const hashedPIN = await this.hashPIN(pin);
      await SecureStore.setItemAsync('user_pin', hashedPIN);
      await this.logSecurityEvent('pin_set', 'info');
      
      return { success: true };
    } catch (error) {
      console.error('Failed to set PIN:', error);
      return { success: false, error: error.message };
    }
  }

  async verifyPIN(pin) {
    try {
      const storedHash = await SecureStore.getItemAsync('user_pin');
      if (!storedHash) {
        throw new Error('No PIN set');
      }

      const hashedPIN = await this.hashPIN(pin);
      const isValid = hashedPIN === storedHash;

      if (isValid) {
        this.isAuthenticated = true;
        this.authLevel = 'pin';
        this.updateLastActivity();
        await this.logSecurityEvent('pin_auth_success', 'info');
      } else {
        await this.logSecurityEvent('pin_auth_failed', 'warning');
      }

      return { success: isValid };
    } catch (error) {
      console.error('PIN verification failed:', error);
      await this.logSecurityEvent('pin_auth_error', 'error', {
        error: error.message
      });
      return { success: false, error: error.message };
    }
  }

  validatePIN(pin) {
    return /^\d{4,6}$/.test(pin);
  }

  async hashPIN(pin) {
    const salt = await this.getSalt();
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      pin + salt
    );
  }

  async getSalt() {
    let salt = await SecureStore.getItemAsync('pin_salt');
    if (!salt) {
      salt = Math.random().toString(36).substring(2, 15);
      await SecureStore.setItemAsync('pin_salt', salt);
    }
    return salt;
  }

  // Session Management
  updateLastActivity() {
    this.lastActivity = Date.now();
  }

  isSessionExpired() {
    return Date.now() - this.lastActivity > this.sessionTimeout;
  }

  async requireAuthentication(reason = 'Authentication required') {
    if (this.isAuthenticated && !this.isSessionExpired()) {
      this.updateLastActivity();
      return { success: true };
    }

    // Try biometric first, fall back to PIN
    const biometricResult = await this.authenticateWithBiometrics(reason);
    if (biometricResult.success) {
      return biometricResult;
    }

    // If biometric fails, prompt for PIN
    return await this.promptForPIN(reason);
  }

  async promptForPIN(reason) {
    return new Promise((resolve) => {
      Alert.prompt(
        'Enter PIN',
        reason,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve({ success: false, cancelled: true }),
          },
          {
            text: 'OK',
            onPress: async (pin) => {
              const result = await this.verifyPIN(pin);
              resolve(result);
            },
          },
        ],
        'secure-text'
      );
    });
  }

  logout() {
    this.isAuthenticated = false;
    this.authLevel = 'none';
    this.logSecurityEvent('user_logout', 'info');
  }

  // Secure Storage
  async securelyStore(key, value) {
    try {
      await SecureStore.setItemAsync(key, JSON.stringify(value));
      return { success: true };
    } catch (error) {
      console.error('Failed to securely store data:', error);
      return { success: false, error: error.message };
    }
  }

  async securelyRetrieve(key) {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Failed to securely retrieve data:', error);
      return null;
    }
  }

  async securelyDelete(key) {
    try {
      await SecureStore.deleteItemAsync(key);
      return { success: true };
    } catch (error) {
      console.error('Failed to securely delete data:', error);
      return { success: false, error: error.message };
    }
  }

  // Encryption/Decryption
  async encryptData(data, key = null) {
    try {
      const encryptionKey = key || await this.getEncryptionKey();
      const dataString = typeof data === 'string' ? data : JSON.stringify(data);
      
      // Simple encryption (in production, use more robust encryption)
      const encrypted = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        encryptionKey + dataString
      );
      
      return { success: true, encrypted };
    } catch (error) {
      console.error('Failed to encrypt data:', error);
      return { success: false, error: error.message };
    }
  }

  async getEncryptionKey() {
    let key = await SecureStore.getItemAsync('encryption_key');
    if (!key) {
      key = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Math.random().toString(36) + Date.now().toString()
      );
      await SecureStore.setItemAsync('encryption_key', key);
    }
    return key;
  }

  // Security Events Logging
  async logSecurityEvent(event, level = 'info', metadata = {}) {
    const eventData = {
      event,
      level,
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
      metadata,
    };

    this.securityEvents.push(eventData);
    
    try {
      // Store locally
      await this.persistSecurityEvents();
      
      // Send notification for high-level events
      if (level === 'warning' || level === 'error') {
        await NotificationManager.sendSecurityAlert(
          `Security event: ${event}`,
          level
        );
      }

      console.log('Security event logged:', eventData);
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  async persistSecurityEvents() {
    try {
      // Keep only last 100 events
      const recentEvents = this.securityEvents.slice(-100);
      await AsyncStorage.setItem('security_events', JSON.stringify(recentEvents));
      this.securityEvents = recentEvents;
    } catch (error) {
      console.error('Failed to persist security events:', error);
    }
  }

  async getSecurityEvents(level = null) {
    try {
      const stored = await AsyncStorage.getItem('security_events');
      const events = stored ? JSON.parse(stored) : [];
      
      if (level) {
        return events.filter(event => event.level === level);
      }
      
      return events;
    } catch (error) {
      console.error('Failed to get security events:', error);
      return [];
    }
  }

  // Device Security Checks
  async performSecurityCheck() {
    const checks = {
      biometricAvailable: false,
      pinSet: false,
      deviceSecure: false,
      appIntegrity: true,
      networkSecure: true,
    };

    try {
      // Check biometric availability
      const biometricInfo = await this.checkBiometricSupport();
      checks.biometricAvailable = biometricInfo.available;

      // Check if PIN is set
      const storedPIN = await SecureStore.getItemAsync('user_pin');
      checks.pinSet = !!storedPIN;

      // Check device security (simplified)
      checks.deviceSecure = Platform.OS === 'ios' ? true : await this.checkAndroidSecurity();

      await this.logSecurityEvent('security_check_completed', 'info', checks);
      
      return checks;
    } catch (error) {
      console.error('Security check failed:', error);
      await this.logSecurityEvent('security_check_failed', 'error', {
        error: error.message
      });
      return checks;
    }
  }

  async checkAndroidSecurity() {
    // Simplified Android security check
    // In production, use more comprehensive checks
    return true;
  }

  // Fraud Detection (Basic)
  async detectSuspiciousActivity(transactionData) {
    const suspiciousIndicators = [];

    try {
      // Check transaction amount
      if (transactionData.amount > 1000) {
        suspiciousIndicators.push('Large transaction amount');
      }

      // Check time of transaction
      const hour = new Date().getHours();
      if (hour < 6 || hour > 23) {
        suspiciousIndicators.push('Unusual transaction time');
      }

      // Check frequency (simplified)
      const recentTransactions = await this.getRecentTransactions();
      if (recentTransactions.length > 5) {
        suspiciousIndicators.push('High transaction frequency');
      }

      if (suspiciousIndicators.length > 0) {
        await this.logSecurityEvent('suspicious_activity_detected', 'warning', {
          indicators: suspiciousIndicators,
          transaction: transactionData,
        });

        await NotificationManager.sendSecurityAlert(
          `Suspicious activity detected: ${suspiciousIndicators.join(', ')}`,
          'high'
        );

        return { suspicious: true, indicators: suspiciousIndicators };
      }

      return { suspicious: false, indicators: [] };
    } catch (error) {
      console.error('Fraud detection failed:', error);
      return { suspicious: false, indicators: [] };
    }
  }

  async getRecentTransactions() {
    // This would integrate with your transaction storage
    // For now, return mock data
    return [];
  }

  // Security Settings
  async getSecuritySettings() {
    try {
      const settings = await AsyncStorage.getItem('security_settings');
      return settings ? JSON.parse(settings) : {
        biometricEnabled: false,
        pinEnabled: false,
        sessionTimeout: 5,
        fraudDetection: true,
        notifications: true,
      };
    } catch (error) {
      console.error('Failed to get security settings:', error);
      return {};
    }
  }

  async updateSecuritySettings(settings) {
    try {
      await AsyncStorage.setItem('security_settings', JSON.stringify(settings));
      
      // Update session timeout if changed
      if (settings.sessionTimeout) {
        this.sessionTimeout = settings.sessionTimeout * 60 * 1000;
      }

      await this.logSecurityEvent('security_settings_updated', 'info', settings);
      return { success: true };
    } catch (error) {
      console.error('Failed to update security settings:', error);
      return { success: false, error: error.message };
    }
  }

  // Emergency Security
  async emergencyLockdown() {
    try {
      // Clear sensitive data
      await SecureStore.deleteItemAsync('user_pin');
      await SecureStore.deleteItemAsync('encryption_key');
      
      // Clear app data
      await AsyncStorage.multiRemove([
        'user_session',
        'wallet_data',
        'transaction_cache',
      ]);

      // Log out
      this.logout();

      await this.logSecurityEvent('emergency_lockdown', 'error');
      
      await NotificationManager.sendSecurityAlert(
        'Emergency lockdown activated - all data cleared',
        'high'
      );

      return { success: true };
    } catch (error) {
      console.error('Emergency lockdown failed:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export default new SecurityService();

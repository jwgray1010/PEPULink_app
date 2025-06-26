import NotificationManager from './NotificationManager';
import AnalyticsService from './Analytics';
import SecurityService from './Security';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ServiceManager {
  constructor() {
    this.initialized = false;
    this.services = {
      notifications: NotificationManager,
      analytics: AnalyticsService,
      security: SecurityService,
    };
  }

  async initialize() {
    if (this.initialized) return { success: true };

    try {
      console.log('Initializing PEPULink services...');

      // Initialize all services in parallel
      const initPromises = [
        this.services.notifications.initialize(),
        this.services.analytics.initialize(),
        this.services.security.performSecurityCheck(),
      ];

      await Promise.all(initPromises);

      // Mark as initialized
      this.initialized = true;
      await AsyncStorage.setItem('services_initialized', 'true');

      // Track successful initialization
      await this.services.analytics.trackEvent('Services Initialized', {
        timestamp: new Date().toISOString(),
        services: Object.keys(this.services),
      });

      console.log('All PEPULink services initialized successfully');
      return { success: true };
    } catch (error) {
      console.error('Service initialization failed:', error);
      
      // Track initialization failure
      if (this.services.analytics.initialized) {
        await this.services.analytics.trackError(error, 'service_initialization');
      }

      return { success: false, error: error.message };
    }
  }

  async getUserOnboardingData() {
    try {
      const [
        onboardingCompleted,
        securitySettings,
        userProperties,
      ] = await Promise.all([
        AsyncStorage.getItem('onboarding_completed'),
        this.services.security.getSecuritySettings(),
        this.services.analytics.getUserProperties(),
      ]);

      return {
        onboardingCompleted: onboardingCompleted === 'true',
        securitySettings,
        userProperties,
      };
    } catch (error) {
      console.error('Failed to get user onboarding data:', error);
      return {
        onboardingCompleted: false,
        securitySettings: {},
        userProperties: {},
      };
    }
  }

  async handleTransaction(transactionData) {
    try {
      // Track transaction
      await this.services.analytics.trackTransaction(
        transactionData.type,
        transactionData.amount,
        transactionData.currency,
        {
          merchant: transactionData.merchant,
          method: transactionData.method,
        }
      );

      // Check for suspicious activity
      const fraudCheck = await this.services.security.detectSuspiciousActivity(transactionData);
      
      if (!fraudCheck.suspicious) {
        // Send transaction notification
        await this.services.notifications.sendTransactionNotification(
          transactionData.amount,
          transactionData.merchant,
          transactionData.type
        );
      } else {
        // Handle suspicious transaction
        await this.handleSuspiciousTransaction(transactionData, fraudCheck);
      }

      return { success: true, fraudCheck };
    } catch (error) {
      console.error('Transaction handling failed:', error);
      await this.services.analytics.trackError(error, 'transaction_handling');
      return { success: false, error: error.message };
    }
  }

  async handleSuspiciousTransaction(transactionData, fraudCheck) {
    try {
      // Log security event
      await this.services.security.logSecurityEvent(
        'suspicious_transaction',
        'warning',
        {
          transaction: transactionData,
          indicators: fraudCheck.indicators,
        }
      );

      // Send security alert notification
      await this.services.notifications.sendSecurityAlert(
        `Suspicious transaction detected: ${fraudCheck.indicators.join(', ')}`,
        'high'
      );

      // Track fraud event
      await this.services.analytics.trackEvent('Fraud Detection', {
        transaction_amount: transactionData.amount,
        indicators: fraudCheck.indicators,
        merchant: transactionData.merchant,
      });

      return { success: true };
    } catch (error) {
      console.error('Suspicious transaction handling failed:', error);
      return { success: false, error: error.message };
    }
  }

  async handleUserAction(action, screen, metadata = {}) {
    try {
      // Update user activity for security
      this.services.security.updateLastActivity();

      // Track user action
      await this.services.analytics.trackUserAction(action, screen, metadata);

      // Provide haptic feedback for important actions
      if (this.isImportantAction(action)) {
        // This would need to be imported from the mobile utils
        // hapticFeedback('medium');
      }

      return { success: true };
    } catch (error) {
      console.error('User action handling failed:', error);
      return { success: false, error: error.message };
    }
  }

  isImportantAction(action) {
    const importantActions = [
      'transaction_initiated',
      'card_frozen',
      'security_settings_changed',
      'wallet_connected',
      'qr_payment_scanned',
    ];
    return importantActions.includes(action);
  }

  async handleAIInteraction(feature, query, responseTime, metadata = {}) {
    try {
      // Track AI interaction
      await this.services.analytics.trackAIInteraction(feature, query, responseTime, metadata);

      // Send AI insight notification if relevant
      if (metadata.insight && metadata.shouldNotify) {
        await this.services.notifications.sendAIInsight(metadata.insight, feature);
      }

      return { success: true };
    } catch (error) {
      console.error('AI interaction handling failed:', error);
      return { success: false, error: error.message };
    }
  }

  async handleCardAction(action, cardType, metadata = {}) {
    try {
      // Track card action
      await this.services.analytics.trackCardAction(action, cardType, metadata);

      // Send notification for card status changes
      if (action === 'freeze' || action === 'unfreeze') {
        await this.services.notifications.sendCardStatusNotification(
          cardType,
          action === 'freeze' ? 'frozen' : 'unfrozen'
        );
      }

      // Log security event for sensitive actions
      if (action === 'freeze' || action === 'limit_changed') {
        await this.services.security.logSecurityEvent(
          `card_${action}`,
          'info',
          { card_type: cardType, ...metadata }
        );
      }

      return { success: true };
    } catch (error) {
      console.error('Card action handling failed:', error);
      return { success: false, error: error.message };
    }
  }

  async handleWalletConnection(walletType, success, metadata = {}) {
    try {
      // Track wallet connection
      await this.services.analytics.trackWalletConnection(walletType, success, metadata);

      // Log security event
      await this.services.security.logSecurityEvent(
        'wallet_connection',
        success ? 'info' : 'warning',
        { wallet_type: walletType, success, ...metadata }
      );

      // Send notification for successful connections
      if (success) {
        await this.services.notifications.sendSecurityAlert(
          `${walletType} wallet connected successfully`,
          'medium'
        );
      }

      return { success: true };
    } catch (error) {
      console.error('Wallet connection handling failed:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserInsights() {
    try {
      const [
        eventCounts,
        mostUsedFeatures,
        sessionAnalytics,
        securityEvents,
      ] = await Promise.all([
        this.services.analytics.getEventCounts('7d'),
        this.services.analytics.getMostUsedFeatures(5),
        this.services.analytics.getSessionAnalytics(),
        this.services.security.getSecurityEvents('warning'),
      ]);

      return {
        eventCounts,
        mostUsedFeatures,
        sessionAnalytics,
        securityEvents,
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to get user insights:', error);
      return null;
    }
  }

  async performMaintenanceTasks() {
    try {
      console.log('Performing maintenance tasks...');

      // Update notification badge count
      await this.services.notifications.updateBadgeCount();

      // Flush analytics data
      await this.services.analytics.flush();

      // Check for security issues
      await this.services.security.performSecurityCheck();

      // Track maintenance completion
      await this.services.analytics.trackEvent('Maintenance Completed', {
        timestamp: new Date().toISOString(),
      });

      console.log('Maintenance tasks completed');
      return { success: true };
    } catch (error) {
      console.error('Maintenance tasks failed:', error);
      return { success: false, error: error.message };
    }
  }

  async exportUserData() {
    try {
      const [
        analyticsData,
        securityEvents,
        notificationData,
      ] = await Promise.all([
        this.services.analytics.exportAnalyticsData(),
        this.services.security.getSecurityEvents(),
        this.services.notifications.getInAppNotifications(),
      ]);

      return {
        analytics: analyticsData,
        security: securityEvents,
        notifications: notificationData,
        exported_at: new Date().toISOString(),
        app_version: '1.0.0',
      };
    } catch (error) {
      console.error('Failed to export user data:', error);
      return null;
    }
  }

  async clearUserData() {
    try {
      console.log('Clearing all user data...');

      // Clear data from all services
      await Promise.all([
        this.services.analytics.clearAnalyticsData(),
        this.services.notifications.clearAllNotifications(),
        this.services.security.emergencyLockdown(),
      ]);

      // Clear app-level data
      await AsyncStorage.multiRemove([
        'onboarding_completed',
        'services_initialized',
        'user_preferences',
      ]);

      console.log('All user data cleared');
      return { success: true };
    } catch (error) {
      console.error('Failed to clear user data:', error);
      return { success: false, error: error.message };
    }
  }

  getServiceStatus() {
    return {
      initialized: this.initialized,
      services: {
        notifications: this.services.notifications.initialized,
        analytics: this.services.analytics.initialized,
        security: this.services.security.isAuthenticated,
      },
    };
  }

  async cleanup() {
    try {
      // Cleanup all services
      this.services.notifications.cleanup();
      await this.services.analytics.trackSessionEnd();
      this.services.security.logout();

      this.initialized = false;
      console.log('Service cleanup completed');
    } catch (error) {
      console.error('Service cleanup failed:', error);
    }
  }
}

// Export singleton instance
export default new ServiceManager();

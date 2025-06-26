import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Analytics from 'expo-analytics-segment';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import ApiService from './ApiService';
import { ANALYTICS_CONFIG } from '../config';

class AnalyticsService {
  constructor() {
    this.initialized = false;
    this.sessionId = null;
    this.userId = null;
    this.events = [];
    this.sessionStartTime = null;
  }

  async initialize(writeKey = null) {
    if (this.initialized) return;

    try {
      this.sessionId = this.generateSessionId();
      this.sessionStartTime = new Date();
      this.userId = await this.getUserId();
      
      // Initialize Segment Analytics if writeKey provided
      if (writeKey) {
        await Analytics.initialize(writeKey);
      }

      // Track app open
      await this.trackEvent('App Opened', {
        session_id: this.sessionId,
        platform: Platform.OS,
        device_model: Device.modelName,
        app_version: Application.nativeApplicationVersion,
      });

      this.initialized = true;
      console.log('AnalyticsService initialized');
    } catch (error) {
      console.error('Failed to initialize AnalyticsService:', error);
    }
  }

  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async getUserId() {
    try {
      let userId = await AsyncStorage.getItem('analytics_user_id');
      if (!userId) {
        userId = this.generateSessionId();
        await AsyncStorage.setItem('analytics_user_id', userId);
      }
      return userId;
    } catch (error) {
      console.error('Failed to get user ID:', error);
      return 'anonymous';
    }
  }

  async trackEvent(eventName, properties = {}) {
    if (!this.initialized) {
      console.warn('AnalyticsService not initialized');
      return;
    }

    const eventData = {
      event: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        session_id: this.sessionId,
        user_id: this.userId,
        platform: Platform.OS,
      },
    };

    try {
      // Store locally
      this.events.push(eventData);
      await this.persistEvents();

      // Send to Segment if available
      if (Analytics.track) {
        await Analytics.track(eventName, eventData.properties);
      }

      // Send to backend API for analytics
      await ApiService.post('/analytics/track', eventData);

      console.log('Event tracked:', eventName, eventData.properties);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  async persistEvents() {
    try {
      // Keep only last 1000 events
      const recentEvents = this.events.slice(-1000);
      await AsyncStorage.setItem('analytics_events', JSON.stringify(recentEvents));
      this.events = recentEvents;
    } catch (error) {
      console.error('Failed to persist events:', error);
    }
  }

  async getStoredEvents() {
    try {
      const stored = await AsyncStorage.getItem('analytics_events');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get stored events:', error);
      return [];
    }
  }

  // Predefined tracking methods for common events
  async trackUserAction(action, screen, properties = {}) {
    await this.trackEvent('User Action', {
      action,
      screen,
      ...properties,
    });
  }

  async trackScreenView(screenName, properties = {}) {
    await this.trackEvent('Screen View', {
      screen_name: screenName,
      ...properties,
    });
  }

  async trackTransaction(type, amount, currency = 'USD', properties = {}) {
    await this.trackEvent('Transaction', {
      transaction_type: type,
      amount,
      currency,
      ...properties,
    });
  }

  async trackWalletConnection(walletType, success = true, properties = {}) {
    await this.trackEvent('Wallet Connection', {
      wallet_type: walletType,
      success,
      ...properties,
    });
  }

  async trackPayment(method, amount, merchant, success = true, properties = {}) {
    await this.trackEvent('Payment', {
      payment_method: method,
      amount,
      merchant,
      success,
      ...properties,
    });
  }

  async trackQRScan(type, success = true, properties = {}) {
    await this.trackEvent('QR Scan', {
      qr_type: type,
      success,
      ...properties,
    });
  }

  async trackAIInteraction(feature, query, response_time, properties = {}) {
    await this.trackEvent('AI Interaction', {
      ai_feature: feature,
      query_length: query?.length || 0,
      response_time,
      ...properties,
    });
  }

  async trackCardAction(action, cardType, properties = {}) {
    await this.trackEvent('Card Action', {
      card_action: action,
      card_type: cardType,
      ...properties,
    });
  }

  async trackSecurityEvent(event, level = 'info', properties = {}) {
    await this.trackEvent('Security Event', {
      security_event: event,
      level,
      ...properties,
    });
  }

  async trackPerformance(metric, value, properties = {}) {
    await this.trackEvent('Performance', {
      metric,
      value,
      ...properties,
    });
  }

  async trackError(error, context, properties = {}) {
    await this.trackEvent('Error', {
      error_message: error.message || error,
      error_stack: error.stack,
      context,
      ...properties,
    });
  }

  async trackFeatureUsage(feature, properties = {}) {
    await this.trackEvent('Feature Usage', {
      feature,
      ...properties,
    });
  }

  async trackOnboarding(step, completed = false, properties = {}) {
    await this.trackEvent('Onboarding', {
      step,
      completed,
      ...properties,
    });
  }

  async trackAuth(method, success = true, properties = {}) {
    await this.trackEvent('Authentication', {
      auth_method: method,
      success,
      ...properties,
    });
  }

  // Session tracking
  async trackSessionEnd() {
    if (!this.sessionStartTime) return;

    const sessionDuration = new Date() - this.sessionStartTime;
    await this.trackEvent('Session End', {
      session_duration: Math.round(sessionDuration / 1000), // in seconds
      events_count: this.events.length,
    });
  }

  // User properties
  async setUserProperties(properties) {
    try {
      await AsyncStorage.setItem('analytics_user_properties', JSON.stringify(properties));
      
      if (Analytics.identify) {
        await Analytics.identify(this.userId, properties);
      }
      
      console.log('User properties set:', properties);
    } catch (error) {
      console.error('Failed to set user properties:', error);
    }
  }

  async getUserProperties() {
    try {
      const stored = await AsyncStorage.getItem('analytics_user_properties');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to get user properties:', error);
      return {};
    }
  }

  // Analytics insights
  async getEventCounts(timeframe = '7d') {
    try {
      const events = await this.getStoredEvents();
      const cutoff = new Date();
      
      switch (timeframe) {
        case '1d':
          cutoff.setDate(cutoff.getDate() - 1);
          break;
        case '7d':
          cutoff.setDate(cutoff.getDate() - 7);
          break;
        case '30d':
          cutoff.setDate(cutoff.getDate() - 30);
          break;
      }

      const recentEvents = events.filter(event => 
        new Date(event.properties.timestamp) > cutoff
      );

      const counts = {};
      recentEvents.forEach(event => {
        counts[event.event] = (counts[event.event] || 0) + 1;
      });

      return counts;
    } catch (error) {
      console.error('Failed to get event counts:', error);
      return {};
    }
  }

  async getMostUsedFeatures(limit = 10) {
    try {
      const events = await this.getStoredEvents();
      const featureEvents = events.filter(event => 
        event.event === 'Feature Usage' || event.event === 'User Action'
      );

      const featureCounts = {};
      featureEvents.forEach(event => {
        const feature = event.properties.feature || event.properties.action;
        if (feature) {
          featureCounts[feature] = (featureCounts[feature] || 0) + 1;
        }
      });

      return Object.entries(featureCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([feature, count]) => ({ feature, count }));
    } catch (error) {
      console.error('Failed to get most used features:', error);
      return [];
    }
  }

  async getSessionAnalytics() {
    try {
      const events = await this.getStoredEvents();
      const sessionEvents = events.filter(event => 
        event.event === 'Session End'
      );

      if (sessionEvents.length === 0) return null;

      const durations = sessionEvents.map(event => 
        event.properties.session_duration || 0
      );

      const avgDuration = durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
      const totalSessions = sessionEvents.length;

      return {
        total_sessions: totalSessions,
        average_duration: Math.round(avgDuration),
        total_duration: durations.reduce((sum, duration) => sum + duration, 0),
      };
    } catch (error) {
      console.error('Failed to get session analytics:', error);
      return null;
    }
  }

  // Data management
  async exportAnalyticsData() {
    try {
      const events = await this.getStoredEvents();
      const userProperties = await this.getUserProperties();
      
      return {
        user_id: this.userId,
        events,
        user_properties: userProperties,
        exported_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to export analytics data:', error);
      return null;
    }
  }

  async clearAnalyticsData() {
    try {
      await AsyncStorage.multiRemove([
        'analytics_events',
        'analytics_user_properties',
        'analytics_user_id'
      ]);
      this.events = [];
      this.userId = await this.getUserId(); // Generate new ID
      console.log('Analytics data cleared');
    } catch (error) {
      console.error('Failed to clear analytics data:', error);
    }
  }

  async flush() {
    try {
      // Force persist any pending events
      await this.persistEvents();
      
      // If using Segment, flush events
      if (Analytics.flush) {
        await Analytics.flush();
      }
      
      console.log('Analytics data flushed');
    } catch (error) {
      console.error('Failed to flush analytics data:', error);
    }
  }
}

// Export singleton instance
export default new AnalyticsService();

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationManager {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Request permissions
      await this.registerForPushNotificationsAsync();
      
      // Set up listeners
      this.setupNotificationListeners();
      
      this.initialized = true;
      console.log('NotificationManager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize NotificationManager:', error);
    }
  }

  async registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4ECDC4',
      });

      // Create specific channels for different notification types
      await Notifications.setNotificationChannelAsync('transactions', {
        name: 'Transactions',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 100, 100, 100],
        lightColor: '#00C851',
        sound: 'default',
      });

      await Notifications.setNotificationChannelAsync('security', {
        name: 'Security Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 250, 500],
        lightColor: '#FF4444',
        sound: 'default',
      });

      await Notifications.setNotificationChannelAsync('ai', {
        name: 'AI Insights',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 150, 150, 150],
        lightColor: '#667eea',
        sound: 'default',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      
      token = (await Notifications.getExpoPushTokenAsync()).data;
      this.expoPushToken = token;
      
      // Store token for later use
      await AsyncStorage.setItem('expoPushToken', token);
      console.log('Push token:', token);
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  }

  setupNotificationListeners() {
    // Listener for notifications received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      this.handleNotificationReceived(notification);
    });

    // Listener for when user taps on notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      this.handleNotificationResponse(response);
    });
  }

  handleNotificationReceived(notification) {
    const { title, body, data } = notification.request.content;
    
    // Provide haptic feedback based on notification type
    switch (data?.type) {
      case 'transaction':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'security':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'ai':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Store notification for in-app display
    this.storeNotificationForInApp(notification);
  }

  handleNotificationResponse(response) {
    const { data } = response.notification.request.content;
    
    // Navigate based on notification type
    if (data?.screen) {
      // This would integrate with your navigation system
      console.log('Navigate to:', data.screen, data.params);
    }

    // Handle specific actions
    if (data?.action) {
      this.handleNotificationAction(data.action, data);
    }
  }

  handleNotificationAction(action, data) {
    switch (action) {
      case 'view_transaction':
        // Navigate to transaction details
        break;
      case 'freeze_card':
        // Trigger card freeze
        break;
      case 'view_ai_insight':
        // Navigate to AI insights
        break;
      default:
        console.log('Unknown notification action:', action);
    }
  }

  async storeNotificationForInApp(notification) {
    try {
      const stored = await AsyncStorage.getItem('inAppNotifications');
      const notifications = stored ? JSON.parse(stored) : [];
      
      notifications.unshift({
        id: notification.request.identifier,
        title: notification.request.content.title,
        body: notification.request.content.body,
        data: notification.request.content.data,
        timestamp: new Date().toISOString(),
        read: false,
      });

      // Keep only last 50 notifications
      const trimmed = notifications.slice(0, 50);
      await AsyncStorage.setItem('inAppNotifications', JSON.stringify(trimmed));
    } catch (error) {
      console.error('Failed to store notification:', error);
    }
  }

  // Predefined notification types
  async sendTransactionNotification(amount, merchant, type = 'payment') {
    const title = type === 'payment' ? 'Payment Sent' : 'Payment Received';
    const body = `$${amount} ${type === 'payment' ? 'to' : 'from'} ${merchant}`;
    
    await this.scheduleNotification({
      title,
      body,
      data: {
        type: 'transaction',
        amount,
        merchant,
        transactionType: type,
        screen: 'History',
        action: 'view_transaction',
      },
      channelId: 'transactions',
    });
  }

  async sendSecurityAlert(message, severity = 'medium') {
    await this.scheduleNotification({
      title: 'Security Alert',
      body: message,
      data: {
        type: 'security',
        severity,
        screen: 'Profile',
        action: 'view_security',
      },
      channelId: 'security',
      priority: 'high',
    });
  }

  async sendAIInsight(insight, category = 'spending') {
    await this.scheduleNotification({
      title: 'AI Insight',
      body: insight,
      data: {
        type: 'ai',
        category,
        screen: 'Analytics',
        action: 'view_ai_insight',
      },
      channelId: 'ai',
    });
  }

  async sendCardStatusNotification(cardName, status) {
    const title = `Card ${status === 'frozen' ? 'Frozen' : 'Unfrozen'}`;
    const body = `Your ${cardName} has been ${status}`;
    
    await this.scheduleNotification({
      title,
      body,
      data: {
        type: 'card',
        cardName,
        status,
        screen: 'Card',
        action: 'view_card',
      },
      channelId: 'default',
    });
  }

  async scheduleNotification({ title, body, data = {}, channelId = 'default', priority = 'normal', delay = 0 }) {
    try {
      const notification = {
        content: {
          title,
          body,
          data: {
            ...data,
            timestamp: new Date().toISOString(),
          },
          sound: 'default',
          priority: priority === 'high' ? Notifications.AndroidImportance.MAX : Notifications.AndroidImportance.DEFAULT,
        },
        trigger: delay > 0 ? { seconds: delay } : null,
      };

      if (Platform.OS === 'android') {
        notification.content.channelId = channelId;
      }

      const identifier = await Notifications.scheduleNotificationAsync(notification);
      console.log('Notification scheduled:', identifier);
      return identifier;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  }

  async getInAppNotifications() {
    try {
      const stored = await AsyncStorage.getItem('inAppNotifications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get in-app notifications:', error);
      return [];
    }
  }

  async markNotificationAsRead(notificationId) {
    try {
      const stored = await AsyncStorage.getItem('inAppNotifications');
      const notifications = stored ? JSON.parse(stored) : [];
      
      const updated = notifications.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      
      await AsyncStorage.setItem('inAppNotifications', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  async clearAllNotifications() {
    try {
      await AsyncStorage.removeItem('inAppNotifications');
      await Notifications.dismissAllNotificationsAsync();
      console.log('All notifications cleared');
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }

  async getBadgeCount() {
    try {
      const notifications = await this.getInAppNotifications();
      return notifications.filter(notif => !notif.read).length;
    } catch (error) {
      console.error('Failed to get badge count:', error);
      return 0;
    }
  }

  async updateBadgeCount() {
    try {
      const count = await this.getBadgeCount();
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Failed to update badge count:', error);
    }
  }

  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
    this.initialized = false;
  }
}

// Export singleton instance
export default new NotificationManager();

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import SmartSpendingAIChat from './SmartSpendingAIChat';
import AdvancedAIFeatures from './AdvancedAIFeatures';

const { width } = Dimensions.get('window');

// AI Quick Actions Component
const AIQuickActions = ({ onActionPress, spendingData }) => {
  const quickActions = [
    {
      id: 'analyze',
      title: 'Analyze Spending',
      icon: '📊',
      description: 'Get instant insights on your spending patterns',
      gradient: ['#667eea', '#764ba2'],
      action: () => onActionPress('chat', 'Analyze my spending patterns')
    },
    {
      id: 'predict',
      title: 'Spending Forecast',
      icon: '🔮',
      description: 'Predict next month\'s expenses',
      gradient: ['#f093fb', '#f5576c'],
      action: () => onActionPress('chat', 'Predict my next month spending')
    },
    {
      id: 'optimize',
      title: 'Budget Optimizer',
      icon: '🎯',
      description: 'Get personalized saving recommendations',
      gradient: ['#4facfe', '#00f2fe'],
      action: () => onActionPress('chat', 'How can I optimize my budget?')
    },
    {
      id: 'insights',
      title: 'Smart Insights',
      icon: '💡',
      description: 'Discover hidden spending patterns',
      gradient: ['#a8edea', '#fed6e3'],
      action: () => onActionPress('chat', 'Give me smart spending tips')
    }
  ];

  return (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.quickActionsTitle}>🤖 AI Quick Actions</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.quickActionCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              action.action();
            }}
          >
            <LinearGradient
              colors={action.gradient}
              style={styles.quickActionGradient}
            >
              <Text style={styles.quickActionIcon}>{action.icon}</Text>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
              <Text style={styles.quickActionDescription}>{action.description}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// AI Status Indicator
const AIStatusIndicator = ({ isActive, type = 'chat' }) => {
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (isActive) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <Animated.View style={[styles.aiStatusIndicator, { transform: [{ scale: pulseAnim }] }]}>
      <Text style={styles.aiStatusText}>
        {type === 'chat' ? '🤖 AI Active' : '🧠 AI Analyzing'}
      </Text>
    </Animated.View>
  );
};

// Main AI Integration Hub
export default function AIIntegrationHub({ 
  visible, 
  onClose, 
  spendingData = {},
  defaultMode = 'dashboard' // dashboard, chat, features
}) {
  const [currentMode, setCurrentMode] = useState(defaultMode);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState('');

  const handleActionPress = (action, message = '') => {
    if (action === 'chat') {
      setChatInitialMessage(message);
      setShowAIChat(true);
    } else if (action === 'features') {
      setShowAdvancedFeatures(true);
    }
  };

  const aiInsights = [
    {
      type: 'alert',
      icon: '⚠️',
      title: 'Spending Alert',
      message: 'You\'ve spent 15% more on dining this month',
      action: 'Get tips',
      priority: 'high'
    },
    {
      type: 'tip',
      icon: '💡',
      title: 'Smart Tip',
      message: 'Switch to annual subscriptions to save $120/month',
      action: 'Apply now',
      priority: 'medium'
    },
    {
      type: 'prediction',
      icon: '🔮',
      title: 'Forecast',
      message: 'Based on trends, expect $1,750 spending next month',
      action: 'Plan budget',
      priority: 'low'
    }
  ];

  const renderDashboard = () => (
    <ScrollView style={styles.dashboardContainer} showsVerticalScrollIndicator={false}>
      {/* AI Status */}
      <View style={styles.aiStatusContainer}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.aiStatusCard}
        >
          <Text style={styles.aiStatusMainTitle}>🤖 PEPULink AI</Text>
          <Text style={styles.aiStatusSubtitle}>
            Your intelligent financial assistant is ready
          </Text>
          <View style={styles.aiStatsRow}>
            <View style={styles.aiStat}>
              <Text style={styles.aiStatNumber}>47</Text>
              <Text style={styles.aiStatLabel}>Insights Generated</Text>
            </View>
            <View style={styles.aiStat}>
              <Text style={styles.aiStatNumber}>$240</Text>
              <Text style={styles.aiStatLabel}>Savings Identified</Text>
            </View>
            <View style={styles.aiStat}>
              <Text style={styles.aiStatNumber}>94%</Text>
              <Text style={styles.aiStatLabel}>Accuracy</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Quick Actions */}
      <AIQuickActions onActionPress={handleActionPress} spendingData={spendingData} />

      {/* AI Insights */}
      <View style={styles.insightsContainer}>
        <View style={styles.insightsHeader}>
          <Text style={styles.insightsTitle}>🧠 Latest Insights</Text>
          <TouchableOpacity onPress={() => handleActionPress('chat', 'Show me all insights')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {aiInsights.map((insight, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.insightCard, styles[`insight${insight.type}`]]}
            onPress={() => handleActionPress('chat', insight.message)}
          >
            <View style={styles.insightHeader}>
              <Text style={styles.insightIcon}>{insight.icon}</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightMessage}>{insight.message}</Text>
              </View>
            </View>
            <Text style={styles.insightAction}>{insight.action}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Advanced Features Access */}
      <TouchableOpacity 
        style={styles.advancedFeaturesButton}
        onPress={() => setShowAdvancedFeatures(true)}
      >
        <LinearGradient
          colors={['#f093fb', '#f5576c']}
          style={styles.advancedFeaturesGradient}
        >
          <Text style={styles.advancedFeaturesIcon}>🚀</Text>
          <View style={styles.advancedFeaturesContent}>
            <Text style={styles.advancedFeaturesTitle}>Advanced AI Features</Text>
            <Text style={styles.advancedFeaturesSubtitle}>
              Explore cutting-edge financial AI tools
            </Text>
          </View>
          <Text style={styles.advancedFeaturesArrow}>→</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <LinearGradient
          colors={['#f7fafc', '#edf2f7']}
          style={styles.container}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>AI Hub</Text>
            <View style={styles.headerSpacer} />
          </View>

          {renderDashboard()}
        </LinearGradient>
      </Modal>

      {/* AI Chat Modal */}
      <SmartSpendingAIChat
        visible={showAIChat}
        onClose={() => setShowAIChat(false)}
        spendingData={spendingData}
        initialMessage={chatInitialMessage}
      />

      {/* Advanced Features Modal */}
      <AdvancedAIFeatures
        visible={showAdvancedFeatures}
        onClose={() => setShowAdvancedFeatures(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  dashboardContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // AI Status
  aiStatusContainer: {
    marginBottom: 30,
  },
  aiStatusCard: {
    borderRadius: 20,
    padding: 24,
  },
  aiStatusMainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  aiStatusSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  aiStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  aiStat: {
    alignItems: 'center',
  },
  aiStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  aiStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  
  // Quick Actions
  quickActionsContainer: {
    marginBottom: 30,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  quickActionCard: {
    width: 180,
    marginRight: 15,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionGradient: {
    padding: 20,
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  quickActionDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 16,
  },
  
  // Insights
  insightsContainer: {
    marginBottom: 30,
  },
  insightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  viewAllText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  insightalert: {
    borderLeftColor: '#EF4444',
  },
  insighttip: {
    borderLeftColor: '#10B981',
  },
  insightprediction: {
    borderLeftColor: '#8B5CF6',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  insightMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  insightAction: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    alignSelf: 'flex-start',
  },
  
  // Advanced Features
  advancedFeaturesButton: {
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
  },
  advancedFeaturesGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  advancedFeaturesIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  advancedFeaturesContent: {
    flex: 1,
  },
  advancedFeaturesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  advancedFeaturesSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  advancedFeaturesArrow: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  
  // AI Status Indicator
  aiStatusIndicator: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: '#667eea',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    zIndex: 1000,
  },
  aiStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

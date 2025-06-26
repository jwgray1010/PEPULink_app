import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  RefreshControl,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const AIInsightCard = ({ title, value, trend, icon, color, onPress }) => (
  <TouchableOpacity style={styles.insightCard} onPress={onPress}>
    <LinearGradient colors={color} style={styles.insightGradient}>
      <View style={styles.insightHeader}>
        <Text style={styles.insightIcon}>{icon}</Text>
        <Text style={styles.insightTitle}>{title}</Text>
      </View>
      <Text style={styles.insightValue}>{value}</Text>
      {trend && (
        <Text style={[styles.insightTrend, { color: trend.includes('+') ? '#4CAF50' : '#F44336' }]}>
          {trend}
        </Text>
      )}
    </LinearGradient>
  </TouchableOpacity>
);

const CustomerSegmentCard = ({ segment, onPress }) => (
  <TouchableOpacity style={styles.segmentCard} onPress={onPress}>
    <View style={styles.segmentHeader}>
      <Text style={styles.segmentIcon}>{segment.icon}</Text>
      <View style={styles.segmentInfo}>
        <Text style={styles.segmentTitle}>{segment.title}</Text>
        <Text style={styles.segmentCount}>{segment.count} customers</Text>
      </View>
      <Text style={styles.segmentPercentage}>{segment.percentage}%</Text>
    </View>
    <View style={styles.segmentMetrics}>
      <View style={styles.segmentMetric}>
        <Text style={styles.metricLabel}>Avg. Spend</Text>
        <Text style={styles.metricValue}>${segment.avgSpend}</Text>
      </View>
      <View style={styles.segmentMetric}>
        <Text style={styles.metricLabel}>Retention</Text>
        <Text style={styles.metricValue}>{segment.retention}%</Text>
      </View>
      <View style={styles.segmentMetric}>
        <Text style={styles.metricLabel}>Frequency</Text>
        <Text style={styles.metricValue}>{segment.frequency}x/month</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const RecommendationCard = ({ recommendation, onImplement }) => (
  <View style={styles.recommendationCard}>
    <View style={styles.recommendationHeader}>
      <Text style={styles.recommendationIcon}>{recommendation.icon}</Text>
      <View style={styles.recommendationInfo}>
        <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
        <Text style={styles.recommendationImpact}>
          Expected Impact: {recommendation.expectedImpact}
        </Text>
      </View>
      <View style={styles.recommendationPriority}>
        <Text style={[styles.priorityText, { 
          color: recommendation.priority === 'High' ? '#F44336' : 
                recommendation.priority === 'Medium' ? '#FF9800' : '#4CAF50' 
        }]}>
          {recommendation.priority}
        </Text>
      </View>
    </View>
    <Text style={styles.recommendationDescription}>{recommendation.description}</Text>
    <TouchableOpacity
      style={styles.implementButton}
      onPress={() => onImplement(recommendation)}
    >
      <LinearGradient colors={['#4CAF50', '#45a049']} style={styles.implementGradient}>
        <Text style={styles.implementText}>Implement Now</Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>
);

const AIMerchantAnalytics = ({ merchantData, onClose }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    retentionRate: 78.5,
    averageLifetimeValue: 485.30,
    churnRisk: 12.3,
    forecastedRevenue: 8420.50,
    aiConfidence: 94.2
  });

  const [customerSegments, setCustomerSegments] = useState([
    {
      id: 1,
      title: 'VIP Customers',
      icon: '👑',
      count: 45,
      percentage: 15.2,
      avgSpend: 156.80,
      retention: 95.4,
      frequency: 8.2,
      description: 'High-value customers with consistent spending patterns'
    },
    {
      id: 2,
      title: 'Regular Customers',
      icon: '🎯',
      count: 128,
      percentage: 43.1,
      avgSpend: 78.50,
      retention: 82.1,
      frequency: 4.5,
      description: 'Loyal customers with moderate spending'
    },
    {
      id: 3,
      title: 'Occasional Visitors',
      icon: '🚶',
      count: 89,
      percentage: 30.0,
      avgSpend: 32.40,
      retention: 45.2,
      frequency: 1.8,
      description: 'Infrequent customers with growth potential'
    },
    {
      id: 4,
      title: 'At-Risk Customers',
      icon: '⚠️',
      count: 35,
      percentage: 11.7,
      avgSpend: 24.10,
      retention: 25.8,
      frequency: 0.9,
      description: 'Customers showing signs of churn'
    }
  ]);

  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      title: 'Launch VIP Loyalty Program',
      icon: '🌟',
      priority: 'High',
      expectedImpact: '+15% retention',
      description: 'Create exclusive rewards for top customers to increase loyalty and spending frequency.',
      category: 'retention',
      implementation: 'loyalty_program'
    },
    {
      id: 2,
      title: 'Weekend Promotion Campaign',
      icon: '🎉',
      priority: 'Medium',
      expectedImpact: '+22% weekend sales',
      description: 'AI detected low weekend traffic. Implement targeted promotions for Friday-Sunday.',
      category: 'promotion',
      implementation: 'weekend_campaign'
    },
    {
      id: 3,
      title: 'Re-engagement NFT Collection',
      icon: '🎨',
      priority: 'High',
      expectedImpact: '+30% at-risk recovery',
      description: 'Create limited edition NFTs to re-engage customers who haven\'t visited in 30+ days.',
      category: 'nft_rewards',
      implementation: 'nft_campaign'
    },
    {
      id: 4,
      title: 'Dynamic Pricing Strategy',
      icon: '💡',
      priority: 'Medium',
      expectedImpact: '+8% profit margin',
      description: 'Implement AI-driven pricing based on demand patterns and customer segments.',
      category: 'pricing',
      implementation: 'dynamic_pricing'
    }
  ]);

  const [forecastData, setForecastData] = useState([
    { period: 'Next 7 Days', amount: 1245.30, confidence: 96.2, trend: '+12%' },
    { period: 'Next 30 Days', amount: 5680.75, confidence: 92.8, trend: '+18%' },
    { period: 'Next Quarter', amount: 18420.50, confidence: 87.5, trend: '+25%' },
    { period: 'Next Year', amount: 78540.25, confidence: 82.1, trend: '+35%' }
  ]);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    // Simulate AI analytics processing
    try {
      // In a real app, this would call your AI analytics API
      console.log('Loading AI analytics data...');
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSegmentPress = (segment) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      segment.title,
      `${segment.description}\n\nWould you like to create a targeted campaign for this segment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create Campaign', onPress: () => createTargetedCampaign(segment) }
      ]
    );
  };

  const createTargetedCampaign = (segment) => {
    Alert.alert(
      'Campaign Created',
      `AI-powered campaign created for ${segment.title}. Expected to reach ${segment.count} customers with personalized offers.`
    );
  };

  const handleImplementRecommendation = (recommendation) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    switch (recommendation.implementation) {
      case 'loyalty_program':
        Alert.alert(
          'VIP Loyalty Program',
          'This will create a multi-tier loyalty program with NFT rewards, exclusive discounts, and priority access.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Setup Program', onPress: () => setupLoyaltyProgram() }
          ]
        );
        break;
      case 'weekend_campaign':
        Alert.alert(
          'Weekend Campaign',
          'AI will automatically create targeted promotions for Friday-Sunday based on customer preferences.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Launch Campaign', onPress: () => launchWeekendCampaign() }
          ]
        );
        break;
      case 'nft_campaign':
        Alert.alert(
          'NFT Re-engagement',
          'Create limited edition NFTs as rewards to bring back inactive customers.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Create NFTs', onPress: () => createNFTCampaign() }
          ]
        );
        break;
      default:
        Alert.alert('Feature Coming Soon', 'This recommendation will be available soon!');
    }
  };

  const setupLoyaltyProgram = () => {
    Alert.alert('Success', 'VIP Loyalty Program has been activated! Customers will start earning rewards immediately.');
  };

  const launchWeekendCampaign = () => {
    Alert.alert('Success', 'Weekend promotion campaign is now live! AI will optimize offers in real-time.');
  };

  const createNFTCampaign = () => {
    Alert.alert('Success', 'NFT collection is being generated! Customers will receive exclusive digital rewards.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onClose();
          }}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Merchant Analytics</Text>
        <Text style={styles.headerSubtitle}>{merchantData?.businessName}</Text>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* AI Insights Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤖 AI-Powered Insights</Text>
          <View style={styles.insightsGrid}>
            <AIInsightCard
              title="Retention Rate"
              value={`${analyticsData.retentionRate}%`}
              trend="+5.2% vs last month"
              icon="🎯"
              color={['#4CAF50', '#45a049']}
              onPress={() => Alert.alert('Retention Analysis', 'Your customer retention is above industry average!')}
            />
            <AIInsightCard
              title="Avg. Lifetime Value"
              value={`$${analyticsData.averageLifetimeValue}`}
              trend="+12.8% vs last month"
              icon="💰"
              color={['#2196F3', '#1976D2']}
              onPress={() => Alert.alert('Lifetime Value', 'Customer value has increased significantly!')}
            />
            <AIInsightCard
              title="Churn Risk"
              value={`${analyticsData.churnRisk}%`}
              trend="-3.1% vs last month"
              icon="⚠️"
              color={['#FF9800', '#F57C00']}
              onPress={() => Alert.alert('Churn Analysis', 'Churn risk is decreasing - great job!')}
            />
            <AIInsightCard
              title="AI Confidence"
              value={`${analyticsData.aiConfidence}%`}
              trend="High accuracy"
              icon="🧠"
              color={['#9C27B0', '#7B1FA2']}
              onPress={() => Alert.alert('AI Confidence', 'Our predictions are highly accurate based on your data.')}
            />
          </View>
        </View>

        {/* Customer Segments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 Customer Segments</Text>
          {customerSegments.map((segment) => (
            <CustomerSegmentCard
              key={segment.id}
              segment={segment}
              onPress={() => handleSegmentPress(segment)}
            />
          ))}
        </View>

        {/* Revenue Forecast */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Revenue Forecast</Text>
          <View style={styles.forecastContainer}>
            {forecastData.map((forecast, index) => (
              <View key={index} style={styles.forecastCard}>
                <Text style={styles.forecastPeriod}>{forecast.period}</Text>
                <Text style={styles.forecastAmount}>${forecast.amount.toLocaleString()}</Text>
                <View style={styles.forecastMeta}>
                  <Text style={styles.forecastConfidence}>{forecast.confidence}% confidence</Text>
                  <Text style={[styles.forecastTrend, { 
                    color: forecast.trend.includes('+') ? '#4CAF50' : '#F44336' 
                  }]}>
                    {forecast.trend}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* AI Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 AI Recommendations</Text>
          {recommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onImplement={handleImplementRecommendation}
            />
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                Alert.alert('NFT Rewards', 'Create and distribute NFT rewards to your customers!');
              }}
            >
              <LinearGradient colors={['#E91E63', '#C2185B']} style={styles.actionGradient}>
                <Text style={styles.actionIcon}>🎨</Text>
                <Text style={styles.actionText}>Create NFT Rewards</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                Alert.alert('Promotion Builder', 'AI-powered promotion creation tool!');
              }}
            >
              <LinearGradient colors={['#FF5722', '#D84315']} style={styles.actionGradient}>
                <Text style={styles.actionIcon}>🎁</Text>
                <Text style={styles.actionText}>Build Promotion</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                Alert.alert('Loyalty Manager', 'Manage your customer loyalty programs!');
              }}
            >
              <LinearGradient colors={['#3F51B5', '#303F9F']} style={styles.actionGradient}>
                <Text style={styles.actionIcon}>🏆</Text>
                <Text style={styles.actionText}>Loyalty Manager</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : (StatusBar.currentHeight + 10),
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 15,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 25,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  insightCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  insightGradient: {
    padding: 20,
    alignItems: 'center',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  insightValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  insightTrend: {
    fontSize: 12,
    fontWeight: '500',
  },
  segmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  segmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  segmentIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  segmentInfo: {
    flex: 1,
  },
  segmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  segmentCount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  segmentPercentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
  },
  segmentMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  segmentMetric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  forecastContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  forecastCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  forecastPeriod: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  forecastAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  forecastMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forecastConfidence: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  forecastTrend: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  recommendationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recommendationIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  recommendationImpact: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  recommendationPriority: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 15,
  },
  implementButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  implementGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  implementText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '30%',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  actionGradient: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AIMerchantAnalytics;

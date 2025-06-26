import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Animated 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { VictoryChart, VictoryLine, VictoryArea, VictoryAxis, VictoryTheme, VictoryPie } from 'victory-native';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen({ onShowProfessionalAnalytics }) {
  const [selectedPeriod, setSelectedPeriod] = useState('Month');
  
  const timePeriods = ['Week', 'Month', 'Quarter', 'Year'];
  
  const monthlySpendingData = [
    { x: 'Jan', y: 1450 },
    { x: 'Feb', y: 1320 },
    { x: 'Mar', y: 1580 },
    { x: 'Apr', y: 1280 },
    { x: 'May', y: 1620 },
    { x: 'Jun', y: 1410 },
    { x: 'Jul', y: 1720 },
    { x: 'Aug', y: 1350 },
    { x: 'Sep', y: 1540 },
    { x: 'Oct', y: 1480 },
    { x: 'Nov', y: 1650 },
    { x: 'Dec', y: 1580 },
  ];

  const categoryData = [
    { category: 'Food & Dining', amount: 520, percentage: 32, color: '#10B981', target: 600, trend: '+5%' },
    { category: 'Transportation', amount: 340, percentage: 21, color: '#3B82F6', target: 400, trend: '-2%' },
    { category: 'Shopping', amount: 280, percentage: 17, color: '#8B5CF6', target: 350, trend: '+12%' },
    { category: 'Entertainment', amount: 220, percentage: 14, color: '#F59E0B', target: 250, trend: '-8%' },
    { category: 'Healthcare', amount: 150, percentage: 9, color: '#EF4444', target: 200, trend: '+3%' },
    { category: 'Other', amount: 110, percentage: 7, color: '#6B7280', target: 150, trend: '-1%' },
  ];

  const stats = [
    { 
      title: 'Total Spent', 
      value: '$1,620', 
      subtitle: 'This Month', 
      trend: '+12%',
      color: '#10B981',
      icon: '💰'
    },
    { 
      title: 'Daily Average', 
      value: '$52.25', 
      subtitle: 'Per Day', 
      trend: '+8%',
      color: '#3B82F6',
      icon: '📊'
    },
    { 
      title: 'Budget Left', 
      value: '$380', 
      subtitle: '19% Remaining', 
      trend: '-5%',
      color: '#F59E0B',
      icon: '🎯'
    },
    { 
      title: 'Transactions', 
      value: '42', 
      subtitle: 'This Month', 
      trend: '+15%',
      color: '#8B5CF6',
      icon: '🏪'
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.header}
      >
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Smart insights for better spending</Text>
      </LinearGradient>

      {/* Time Period Selector */}
      <View style={styles.periodSelector}>
        <Text style={styles.periodTitle}>Time Period</Text>
        <View style={styles.periodButtons}>
          {timePeriods.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive
              ]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Metrics Cards */}
      <View style={styles.metricsContainer}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricIcon}>{stat.icon}</Text>
                <Text style={[
                  styles.metricTrend,
                  { color: stat.trend.includes('+') ? '#10B981' : '#EF4444' }
                ]}>
                  {stat.trend}
                </Text>
              </View>
              <Text style={styles.metricValue}>{stat.value}</Text>
              <Text style={styles.metricTitle}>{stat.title}</Text>
              <Text style={styles.metricSubtitle}>{stat.subtitle}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Professional Analytics Button */}
      {onShowProfessionalAnalytics && (
        <View style={styles.professionalAnalyticsSection}>
          <TouchableOpacity 
            style={styles.professionalAnalyticsButton}
            onPress={onShowProfessionalAnalytics}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.professionalAnalyticsGradient}
            >
              <Text style={styles.professionalAnalyticsIcon}>📊</Text>
              <View style={styles.professionalAnalyticsText}>
                <Text style={styles.professionalAnalyticsTitle}>Professional Analytics</Text>
                <Text style={styles.professionalAnalyticsSubtitle}>Advanced insights & AI recommendations</Text>
              </View>
              <Text style={styles.professionalAnalyticsArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Monthly Trend Chart */}
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <Text style={styles.sectionTitle}>Monthly Spending Trend</Text>
          <Text style={styles.chartSubtitle}>Last 12 months</Text>
        </View>
        <View style={styles.chartContainer}>
          <VictoryChart
            theme={VictoryTheme.material}
            width={width - 40}
            height={220}
            padding={{ left: 60, top: 20, right: 20, bottom: 50 }}
          >
            <VictoryAxis dependentAxis 
              tickFormat={(x) => `$${x/1000}k`}
              style={{
                tickLabels: { fontSize: 12, fill: "#666" },
                grid: { stroke: "#f0f0f0" }
              }}
            />
            <VictoryAxis 
              style={{
                tickLabels: { fontSize: 12, fill: "#666" },
                axis: { stroke: "#e0e0e0" }
              }}
            />
            <VictoryArea
              data={monthlySpendingData}
              style={{
                data: { 
                  fill: "#10B981", 
                  fillOpacity: 0.1, 
                  stroke: "#10B981", 
                  strokeWidth: 3 
                }
              }}
              animate={{
                duration: 1000,
                onLoad: { duration: 500 }
              }}
            />
            <VictoryLine
              data={monthlySpendingData}
              style={{
                data: { stroke: "#10B981", strokeWidth: 3 }
              }}
              animate={{
                duration: 1000,
                onLoad: { duration: 500 }
              }}
            />
          </VictoryChart>
        </View>
      </View>

      {/* Category Breakdown */}
      <View style={styles.categorySection}>
        <Text style={styles.sectionTitle}>Spending by Category</Text>
        <Text style={styles.sectionSubtitle}>Compare with your targets</Text>
        {categoryData.map((category, index) => (
          <View key={index} style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryInfo}>
                <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
                <Text style={styles.categoryName}>{category.category}</Text>
              </View>
              <View style={styles.categoryStats}>
                <Text style={styles.categoryAmount}>${category.amount}</Text>
                <Text style={[
                  styles.categoryTrend,
                  { color: category.trend.includes('+') ? '#EF4444' : '#10B981' }
                ]}>
                  {category.trend}
                </Text>
              </View>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <View 
                  style={[
                    styles.progressBar, 
                    { 
                      width: `${(category.amount / category.target) * 100}%`,
                      backgroundColor: category.color 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                ${category.amount} of ${category.target} target
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* AI-Powered Insights */}
      <View style={styles.aiInsightsSection}>
        <View style={styles.aiHeader}>
          <Text style={styles.aiTitle}>🤖 AI-Powered Insights</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.aiInsightsScroll}>
          <TouchableOpacity style={[styles.aiInsightCard, styles.spendingAlertCard]}>
            <Text style={styles.aiInsightIcon}>⚠️</Text>
            <Text style={styles.aiInsightTitle}>Spending Alert</Text>
            <Text style={styles.aiInsightText}>
              Food spending is 15% over budget. Consider cooking at home 2-3 times this week.
            </Text>
            <Text style={styles.aiInsightAction}>Tap for tips</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.aiInsightCard, styles.savingTipCard]}>
            <Text style={styles.aiInsightIcon}>💡</Text>
            <Text style={styles.aiInsightTitle}>Smart Tip</Text>
            <Text style={styles.aiInsightText}>
              You could save $120/month by switching to annual subscriptions for your apps.
            </Text>
            <Text style={styles.aiInsightAction}>Apply now</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.aiInsightCard, styles.predictionCard]}>
            <Text style={styles.aiInsightIcon}>🔮</Text>
            <Text style={styles.aiInsightTitle}>Prediction</Text>
            <Text style={styles.aiInsightText}>
              Based on trends, you'll likely spend $1,750 next month. Budget accordingly.
            </Text>
            <Text style={styles.aiInsightAction}>Plan budget</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.aiInsightCard, styles.goalCard]}>
            <Text style={styles.aiInsightIcon}>🎯</Text>
            <Text style={styles.aiInsightTitle}>Goal Update</Text>
            <Text style={styles.aiInsightText}>
              You're on track to save $2,400 this year. Increase by $50/month for $3,000.
            </Text>
            <Text style={styles.aiInsightAction}>Adjust goal</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafe',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  
  // Time Period Selector
  periodSelector: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  periodTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  periodButtons: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  
  // Metrics Cards
  metricsContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - 55) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricIcon: {
    fontSize: 24,
  },
  metricTrend: {
    fontSize: 12,
    fontWeight: '700',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  metricSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  
  // Chart Section
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  
  // Section Titles
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  
  // Category Section
  categorySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  categoryStats: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  categoryTrend: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBackground: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  
  // Insights Section
  insightsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiLabel: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 10,
  },
  aiLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  insightCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  insightGradient: {
    padding: 20,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  insightIcon: {
    fontSize: 24,
  },
  insightBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
    marginBottom: 12,
  },
  insightAction: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  insightActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textDecorationLine: 'underline',
  },
  
  // Professional Analytics Button
  professionalAnalyticsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  professionalAnalyticsButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  professionalAnalyticsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  professionalAnalyticsIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  professionalAnalyticsText: {
    flex: 1,
  },
  professionalAnalyticsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  professionalAnalyticsSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  professionalAnalyticsArrow: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },

  // AI Insights Section
  aiInsightsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  viewAllButton: {
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  aiInsightsScroll: {
    paddingVertical: 8,
  },
  aiInsightCard: {
    width: 240,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  spendingAlertCard: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  savingTipCard: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  predictionCard: {
    backgroundColor: '#FEF7FF',
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  goalCard: {
    backgroundColor: '#FFF7ED',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  aiInsightIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  aiInsightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  aiInsightText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  aiInsightAction: {
    fontSize: 13,
    color: '#667eea',
    fontWeight: '600',
  },
});

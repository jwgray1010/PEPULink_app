import React, { useState, useEffect } from 'react';
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
import { VictoryChart, VictoryLine, VictoryArea, VictoryAxis, VictoryTheme, VictoryPie, VictoryBar } from 'victory-native';

const { width } = Dimensions.get('window');

const StatCard = ({ title, value, subtitle, trend, color, icon }) => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.statCard, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={[color + '20', color + '05']}
        style={styles.statGradient}
      >
        <View style={styles.statHeader}>
          <Text style={styles.statIcon}>{icon}</Text>
          <Text style={[styles.statTrend, { color: trend?.includes('+') ? '#4ECDC4' : '#FF6B6B' }]}>
            {trend}
          </Text>
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statSubtitle}>{subtitle}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

const CategoryProgressBar = ({ category, amount, percentage, color, target }) => (
  <View style={styles.categoryRow}>
    <View style={styles.categoryInfo}>
      <Text style={styles.categoryName}>{category}</Text>
      <Text style={styles.categoryAmount}>${amount}</Text>
    </View>
    <View style={styles.progressContainer}>
      <View style={styles.progressBg}>
        <Animated.View 
          style={[
            styles.progressFill, 
            { 
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: percentage > 90 ? '#FF6B6B' : color 
            }
          ]} 
        />
      </View>
      <Text style={styles.percentageText}>{percentage}%</Text>
    </View>
    {target && (
      <Text style={[
        styles.targetText,
        { color: amount > target ? '#FF6B6B' : '#4ECDC4' }
      ]}>
        Target: ${target}
      </Text>
    )}
  </View>
);

const TimeRangeSelector = ({ selectedRange, onRangeChange }) => {
  const ranges = [
    { key: '7D', label: '7 Days' },
    { key: '1M', label: '1 Month' },
    { key: '3M', label: '3 Months' },
    { key: '1Y', label: '1 Year' }
  ];

  return (
    <View style={styles.timeRangeContainer}>
      {ranges.map((range) => (
        <TouchableOpacity
          key={range.key}
          style={[
            styles.rangeButton,
            selectedRange === range.key && styles.rangeButtonActive
          ]}
          onPress={() => onRangeChange(range.key)}
        >
          <Text style={[
            styles.rangeText,
            selectedRange === range.key && styles.rangeTextActive
          ]}>
            {range.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function ProfessionalAnalyticsDashboard({ spendingData, categoryData, onAIInsights }) {
  const [selectedRange, setSelectedRange] = useState('1M');
  const [selectedView, setSelectedView] = useState('overview');

  const stats = [
    { 
      title: 'Total Spent', 
      value: '$1,280', 
      subtitle: 'This month',
      trend: '-11.7%',
      color: '#FF6B6B',
      icon: '💸'
    },
    { 
      title: 'Daily Average', 
      value: '$42.67', 
      subtitle: 'Per day',
      trend: '+5.2%',
      color: '#4ECDC4',
      icon: '📊'
    },
    { 
      title: 'Savings Rate', 
      value: '23%', 
      subtitle: 'Of income',
      trend: '+2.1%',
      color: '#45B7D1',
      icon: '💰'
    },
    { 
      title: 'Budget Health', 
      value: '89%', 
      subtitle: 'On track',
      trend: '+3.5%',
      color: '#96CEB4',
      icon: '🎯'
    },
  ];

  const spendingTrendData = [
    { x: 1, y: 120, label: 'Week 1' },
    { x: 2, y: 98, label: 'Week 2' },
    { x: 3, y: 156, label: 'Week 3' },
    { x: 4, y: 134, label: 'Week 4' },
    { x: 5, y: 178, label: 'Week 5' },
    { x: 6, y: 142, label: 'Week 6' },
    { x: 7, y: 189, label: 'Week 7' },
  ];

  const categoryBudgets = [
    { category: 'Food & Dining', amount: 450, percentage: 90, color: '#FF6B6B', target: 500 },
    { category: 'Transportation', amount: 280, percentage: 70, color: '#4ECDC4', target: 400 },
    { category: 'Shopping', amount: 320, percentage: 85, color: '#45B7D1', target: 375 },
    { category: 'Entertainment', amount: 180, percentage: 60, color: '#96CEB4', target: 300 },
    { category: 'Bills & Utilities', amount: 450, percentage: 75, color: '#FFEAA7', target: 600 },
  ];

  const pieData = categoryBudgets.map((cat, index) => ({
    x: cat.category.split(' ')[0],
    y: cat.amount,
    fill: cat.color
  }));

  const ViewSelector = () => (
    <View style={styles.viewSelector}>
      {['overview', 'trends', 'categories', 'insights'].map((view) => (
        <TouchableOpacity
          key={view}
          style={[
            styles.viewButton,
            selectedView === view && styles.viewButtonActive
          ]}
          onPress={() => setSelectedView(view)}
        >
          <Text style={[
            styles.viewText,
            selectedView === view && styles.viewTextActive
          ]}>
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOverview = () => (
    <>
      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </View>

      {/* Quick Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Spending Trend (7 Days)</Text>
        <VictoryChart
          theme={VictoryTheme.material}
          height={200}
          width={width - 40}
          padding={{ left: 50, top: 20, right: 20, bottom: 50 }}
        >
          <VictoryArea
            data={spendingTrendData}
            style={{
              data: { fill: "url(#gradient)", fillOpacity: 0.6, stroke: "#45B7D1", strokeWidth: 2 }
            }}
            animate={{
              duration: 1000,
              onLoad: { duration: 500 }
            }}
          />
          <VictoryAxis dependentAxis tickFormat={(x) => `$${x}`} />
          <VictoryAxis fixLabelOverlap={true} />
        </VictoryChart>
      </View>
    </>
  );

  const renderTrends = () => (
    <View style={styles.trendsContainer}>
      <TimeRangeSelector selectedRange={selectedRange} onRangeChange={setSelectedRange} />
      
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Spending Trends</Text>
        <VictoryChart
          theme={VictoryTheme.material}
          height={250}
          width={width - 40}
          padding={{ left: 60, top: 20, right: 20, bottom: 60 }}
        >
          <VictoryLine
            data={spendingTrendData}
            style={{
              data: { stroke: "#45B7D1", strokeWidth: 3 }
            }}
            animate={{
              duration: 1000
            }}
          />
          <VictoryAxis dependentAxis tickFormat={(x) => `$${x}`} />
          <VictoryAxis fixLabelOverlap={true} />
        </VictoryChart>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Monthly Comparison</Text>
        <VictoryChart
          theme={VictoryTheme.material}
          height={200}
          width={width - 40}
          padding={{ left: 60, top: 20, right: 20, bottom: 60 }}
        >
          <VictoryBar
            data={[
              { x: 'Jan', y: 1450 },
              { x: 'Feb', y: 1320 },
              { x: 'Mar', y: 1280 },
            ]}
            style={{
              data: { fill: "#4ECDC4" }
            }}
            animate={{
              duration: 1000
            }}
          />
          <VictoryAxis dependentAxis tickFormat={(x) => `$${x}`} />
          <VictoryAxis />
        </VictoryChart>
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Category Distribution</Text>
        <View style={styles.pieChartContainer}>
          <VictoryPie
            data={pieData}
            width={width - 40}
            height={250}
            innerRadius={50}
            colorScale={categoryBudgets.map(cat => cat.color)}
            animate={{
              duration: 1000
            }}
          />
        </View>
      </View>

      <View style={styles.categoryList}>
        <Text style={styles.chartTitle}>Budget Progress</Text>
        {categoryBudgets.map((category, index) => (
          <CategoryProgressBar key={index} {...category} />
        ))}
      </View>
    </View>
  );

  const renderInsights = () => (
    <View style={styles.insightsContainer}>
      <TouchableOpacity 
        style={styles.aiInsightsButton}
        onPress={onAIInsights}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.aiButtonGradient}
        >
          <Text style={styles.aiInsightsIcon}>🤖</Text>
          <View style={styles.aiInsightsText}>
            <Text style={styles.aiInsightsTitle}>Get AI Insights</Text>
            <Text style={styles.aiInsightsSubtitle}>Personalized recommendations</Text>
          </View>
          <Text style={styles.aiInsightsArrow}>→</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>💡 Smart Insights</Text>
        <Text style={styles.insightText}>
          You're spending 35% more on dining this month. Consider meal prepping to save ~$120.
        </Text>
      </View>

      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>🎯 Budget Alert</Text>
        <Text style={styles.insightText}>
          You're 90% through your dining budget with 8 days left in the month.
        </Text>
      </View>

      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>🏆 Achievement</Text>
        <Text style={styles.insightText}>
          Great job! You've reduced transport costs by 12% this month.
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d']}
        style={styles.header}
      >
        <Text style={styles.title}>Professional Analytics</Text>
        <Text style={styles.subtitle}>Comprehensive financial insights</Text>
      </LinearGradient>

      <ViewSelector />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedView === 'overview' && renderOverview()}
        {selectedView === 'trends' && renderTrends()}
        {selectedView === 'categories' && renderCategories()}
        {selectedView === 'insights' && renderInsights()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 4,
  },
  viewSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  viewButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 4,
  },
  viewButtonActive: {
    backgroundColor: '#45B7D1',
  },
  viewText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  viewTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statCard: {
    width: (width - 60) / 2,
    marginBottom: 15,
    marginHorizontal: 5,
  },
  statGradient: {
    borderRadius: 15,
    padding: 20,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIcon: {
    fontSize: 24,
  },
  statTrend: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  chartContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  rangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  rangeButtonActive: {
    backgroundColor: '#45B7D1',
    borderColor: '#45B7D1',
  },
  rangeText: {
    fontSize: 14,
    color: '#666',
  },
  rangeTextActive: {
    color: '#fff',
  },
  pieChartContainer: {
    alignItems: 'center',
  },
  categoryList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  categoryRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginRight: 10,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 14,
    color: '#666',
    minWidth: 35,
  },
  targetText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  aiInsightsButton: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  aiButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  aiInsightsIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  aiInsightsText: {
    flex: 1,
  },
  aiInsightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  aiInsightsSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  aiInsightsArrow: {
    fontSize: 20,
    color: '#fff',
  },
  insightCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

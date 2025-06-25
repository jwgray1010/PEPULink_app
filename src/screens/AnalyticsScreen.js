import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { VictoryChart, VictoryLine, VictoryArea, VictoryAxis, VictoryTheme } from 'victory-native';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const spendingData = [
    { x: 1, y: 120 },
    { x: 2, y: 98 },
    { x: 3, y: 156 },
    { x: 4, y: 134 },
    { x: 5, y: 178 },
    { x: 6, y: 142 },
    { x: 7, y: 189 },
  ];

  const categoryData = [
    { category: 'Food & Dining', amount: 450, percentage: 35, color: '#FF6B6B' },
    { category: 'Transportation', amount: 280, percentage: 22, color: '#4ECDC4' },
    { category: 'Shopping', amount: 320, percentage: 25, color: '#45B7D1' },
    { category: 'Entertainment', amount: 180, percentage: 14, color: '#96CEB4' },
    { category: 'Other', amount: 50, percentage: 4, color: '#FFEAA7' },
  ];

  const stats = [
    { title: 'This Month', value: '$1,280', subtitle: 'Total Spent', color: '#FF6B6B' },
    { title: 'Daily Average', value: '$42.67', subtitle: 'Per Day', color: '#4ECDC4' },
    { title: 'Savings', value: '$320', subtitle: 'vs Last Month', color: '#45B7D1' },
    { title: 'Transactions', value: '47', subtitle: 'This Month', color: '#96CEB4' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d']}
        style={styles.header}
      >
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Your spending insights</Text>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
            <Text style={styles.statTitle}>{stat.title}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
          </View>
        ))}
      </View>

      {/* Spending Chart */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>7-Day Spending Trend</Text>
        <View style={styles.chartContainer}>
          <VictoryChart
            theme={VictoryTheme.material}
            width={width - 40}
            height={200}
            padding={{ left: 50, top: 20, right: 20, bottom: 40 }}
          >
            <VictoryAxis dependentAxis tickFormat={(x) => `$${x}`} />
            <VictoryAxis />
            <VictoryArea
              data={spendingData}
              style={{
                data: { fill: "#c43a31", fillOpacity: 0.3, stroke: "#c43a31", strokeWidth: 2 }
              }}
            />
          </VictoryChart>
        </View>
      </View>

      {/* Category Breakdown */}
      <View style={styles.categorySection}>
        <Text style={styles.sectionTitle}>Spending by Category</Text>
        {categoryData.map((category, index) => (
          <View key={index} style={styles.categoryItem}>
            <View style={styles.categoryInfo}>
              <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
              <Text style={styles.categoryName}>{category.category}</Text>
            </View>
            <View style={styles.categoryStats}>
              <Text style={styles.categoryAmount}>${category.amount}</Text>
              <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
            </View>
          </View>
        ))}
      </View>

      {/* AI Insights */}
      <View style={styles.insightsSection}>
        <Text style={styles.sectionTitle}>AI Insights</Text>
        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>🤖</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Smart Spending Tip</Text>
            <Text style={styles.insightText}>
              You're spending 23% more on dining this month. Consider meal prepping to save $80-120 monthly.
            </Text>
          </View>
        </View>
        
        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>💡</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Budget Alert</Text>
            <Text style={styles.insightText}>
              You're on track to exceed your entertainment budget by $45. Consider reducing discretionary spending.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 10,
    color: '#666',
  },
  chartSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categorySection: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  categoryStats: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#888',
  },
  insightsSection: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  insightIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  insightText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

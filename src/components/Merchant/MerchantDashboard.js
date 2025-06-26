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
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const MerchantDashboard = ({ merchantData, onGenerateQR, onLogout, onOpenAIAnalytics, onOpenNFTRewards }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalTransactions: 0,
    avgTransactionValue: 0,
    todaysSales: 0,
    weeklyGrowth: 0,
    recentTransactions: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulate loading dashboard data
      // In a real app, this would fetch from your backend
      const mockData = {
        totalSales: 15420.50,
        totalTransactions: 147,
        avgTransactionValue: 104.90,
        todaysSales: 1250.30,
        weeklyGrowth: 12.5,
        recentTransactions: [
          { id: 1, amount: 45.99, customer: 'Customer #1234', time: '2 min ago', status: 'completed' },
          { id: 2, amount: 89.50, customer: 'Customer #1235', time: '15 min ago', status: 'completed' },
          { id: 3, amount: 125.00, customer: 'Customer #1236', time: '1 hour ago', status: 'pending' },
          { id: 4, amount: 67.25, customer: 'Customer #1237', time: '2 hours ago', status: 'completed' },
          { id: 5, amount: 234.99, customer: 'Customer #1238', time: '5 hours ago', status: 'completed' },
        ]
      };
      setDashboardData(mockData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'failed':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Business Info Card */}
      <View style={styles.businessCard}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.businessGradient}
        >
          <Text style={styles.businessName}>{merchantData?.businessName}</Text>
          <Text style={styles.businessType}>{merchantData?.businessCategory}</Text>
          <Text style={styles.merchantId}>ID: {merchantData?.merchantId}</Text>
        </LinearGradient>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onGenerateQR();
            }}
          >
            <LinearGradient
              colors={['#4CAF50', '#45a049']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionIcon}>🎯</Text>
              <Text style={styles.actionText}>Generate QR</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onOpenAIAnalytics && onOpenAIAnalytics();
            }}
          >
            <LinearGradient
              colors={['#2196F3', '#1976D2']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionIcon}>🤖</Text>
              <Text style={styles.actionText}>AI Analytics</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onOpenNFTRewards && onOpenNFTRewards();
            }}
          >
            <LinearGradient
              colors={['#FF9800', '#F57C00']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionIcon}>🎁</Text>
              <Text style={styles.actionText}>NFT Rewards</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Alert.alert('Settings', 'Merchant account settings');
            }}
          >
            <LinearGradient
              colors={['#9C27B0', '#7B1FA2']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionIcon}>⚙️</Text>
              <Text style={styles.actionText}>Settings</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Sales Overview</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatCurrency(dashboardData.totalSales)}</Text>
            <Text style={styles.statLabel}>Total Sales</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboardData.totalTransactions}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatCurrency(dashboardData.avgTransactionValue)}</Text>
            <Text style={styles.statLabel}>Avg. Value</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatCurrency(dashboardData.todaysSales)}</Text>
            <Text style={styles.statLabel}>Today's Sales</Text>
          </View>
        </View>

        <View style={styles.growthCard}>
          <Text style={styles.growthText}>
            📈 Weekly Growth: 
            <Text style={[styles.growthValue, { color: dashboardData.weeklyGrowth >= 0 ? '#4CAF50' : '#F44336' }]}>
              {dashboardData.weeklyGrowth >= 0 ? '+' : ''}{dashboardData.weeklyGrowth}%
            </Text>
          </Text>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.transactionsContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        
        {dashboardData.recentTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionCard}>
            <View style={styles.transactionHeader}>
              <Text style={styles.transactionAmount}>
                {formatCurrency(transaction.amount)}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transaction.status) }]}>
                <Text style={styles.statusText}>{transaction.status}</Text>
              </View>
            </View>
            <Text style={styles.transactionCustomer}>{transaction.customer}</Text>
            <Text style={styles.transactionTime}>{transaction.time}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert('Transaction History', 'View complete transaction history');
          }}
        >
          <Text style={styles.viewAllText}>View All Transactions</Text>
        </TouchableOpacity>
      </View>

      {/* Account Management */}
      <View style={styles.accountSection}>
        <Text style={styles.sectionTitle}>Account Management</Text>
        
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert('Business Profile', 'Edit business information');
          }}
        >
          <Text style={styles.menuIcon}>🏢</Text>
          <Text style={styles.menuText}>Edit Business Profile</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert('Payment Settings', 'Configure payment preferences');
          }}
        >
          <Text style={styles.menuIcon}>💳</Text>
          <Text style={styles.menuText}>Payment Settings</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert('Support', 'Contact merchant support');
          }}
        >
          <Text style={styles.menuIcon}>💬</Text>
          <Text style={styles.menuText}>Support</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.logoutItem]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            onLogout();
          }}
        >
          <Text style={styles.menuIcon}>🚪</Text>
          <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  businessCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  businessGradient: {
    padding: 25,
    alignItems: 'center',
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 5,
  },
  businessType: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 8,
  },
  merchantId: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.7,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  actionButton: {
    width: '48%',
    marginBottom: 10,
    borderRadius: 15,
    overflow: 'hidden',
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
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  growthCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  growthText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  growthValue: {
    fontWeight: 'bold',
  },
  transactionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  transactionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  transactionCustomer: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  transactionTime: {
    fontSize: 12,
    color: '#95a5a6',
  },
  viewAllButton: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#667eea',
    borderStyle: 'dashed',
  },
  viewAllText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  accountSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  menuItem: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 20,
    color: '#bdc3c7',
  },
  logoutItem: {
    borderColor: '#e74c3c',
    borderWidth: 1,
  },
  logoutText: {
    color: '#e74c3c',
  },
});

export default MerchantDashboard;

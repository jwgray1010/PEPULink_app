import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAccount, useBalance } from 'wagmi';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation, onShowAIChat, onShowMerchantQR }) {
  const { theme } = useTheme();
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  const [refreshing, setRefreshing] = useState(false);
  const [cardData] = useState({
    number: "4242 4242 4242 4242",
    name: "PEPU MEMBER",
    expiry: "12/28",
    balance: 1250.75,
    tier: "Gold"
  });

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const quickActions = [
    { 
      id: 1, 
      title: 'QR Scanner', 
      icon: '📱', 
      onPress: () => navigation.navigate('QRScanner')
    },
    { 
      id: 2, 
      title: 'Reload', 
      icon: '🔄', 
      onPress: () => onRefresh()
    },
    { 
      id: 3, 
      title: 'Load', 
      icon: '📂', 
      onPress: () => {
        // Handle load functionality - could navigate to history or load data
        navigation.navigate('History');
      }
    },
    { 
      id: 4, 
      title: 'Request', 
      icon: '�', 
      onPress: () => {
        // Handle request payment functionality
        onShowMerchantQR && onShowMerchantQR();
      }
    }
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.backgroundGradient}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
            />
          }
          contentContainerStyle={styles.scrollContent}
        >
          {/* PEPULink Card */}
          <LinearGradient
            colors={['#4ECDC4', '#44A08D']}
            style={styles.pepulinkCard}
          >
            <View style={styles.cardHeader}>
              <View style={styles.logoContainer}>
                <View style={styles.logo}>
                  <Text style={styles.logoText}>🔗</Text>
                </View>
                <View>
                  <Text style={styles.cardTitle}>PEPULink</Text>
                  <Text style={styles.membershipText}>Gold Member</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.roadmapButton}>
                <Text style={styles.roadmapText}>Roadmap</Text>
              </TouchableOpacity>
            </View>

            {isConnected && address && (
              <View style={styles.addressContainer}>
                <Text style={styles.addressText}>
                  {address.slice(0, 6)}...{address.slice(-4)}
                </Text>
              </View>
            )}

            <View style={styles.balanceSection}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceAmount}>
                ${cardData.balance.toFixed(2)}
              </Text>
              <Text style={styles.cashbackRate}>5% cashback rate</Text>
            </View>

            <View style={styles.monthlySpentContainer}>
              <Text style={styles.monthlyLabel}>This Month</Text>
              <Text style={styles.monthlyAmount}>$2,847.50</Text>
            </View>
          </LinearGradient>

          {/* AI Insights Card */}
          <View style={styles.insightsCard}>
            <Text style={styles.insightsTitle}>🤖 AI Smart Insights</Text>
            
            <View style={styles.insightsRow}>
              <View style={styles.insightItem}>
                <Text style={styles.insightAmount}>$450</Text>
                <Text style={styles.insightLabel}>Dining Spend</Text>
              </View>
              <View style={styles.insightItem}>
                <Text style={styles.insightAmount}>$280</Text>
                <Text style={styles.insightLabel}>Transport</Text>
              </View>
              <View style={styles.insightItem}>
                <Text style={styles.insightAmount}>$320</Text>
                <Text style={styles.insightLabel}>Shopping</Text>
              </View>
            </View>

            <View style={styles.goalProgress}>
              <Text style={styles.goalText}>Monthly Goal: $3,000</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '95%' }]} />
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionButtonsRow}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionButton}
                onPress={action.onPress}
              >
                <LinearGradient
                  colors={['#4ECDC4', '#44A08D']}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionIcon}>{action.icon}</Text>
                  <Text style={styles.actionText}>{action.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Pay Last Merchant */}
          <TouchableOpacity style={styles.payLastMerchant}>
            <Text style={styles.payLastText}>💳 Pay Last Merchant</Text>
          </TouchableOpacity>

          {/* Recent Activity */}
          <View style={styles.recentActivityContainer}>
            <Text style={styles.recentActivityTitle}>Recent Activity</Text>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityIconText}>🍔</Text>
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.merchantName}>Coffee Shop</Text>
                <Text style={styles.activityTime}>2 min ago</Text>
              </View>
              <Text style={styles.activityAmount}>-$25.50</Text>
            </View>

            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityIconText}>💳</Text>
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.merchantName}>Top Up</Text>
                <Text style={styles.activityTime}>1 hour ago</Text>
              </View>
              <Text style={[styles.activityAmount, { color: '#4CAF50' }]}>+$100.00</Text>
            </View>

            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityIconText}>⛽</Text>
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.merchantName}>Gas Station</Text>
                <Text style={styles.activityTime}>3 hours ago</Text>
              </View>
              <Text style={styles.activityAmount}>-$12.99</Text>
            </View>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 120,
  },
  pepulinkCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  membershipText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  roadmapButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  roadmapText: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '600',
  },
  addressContainer: {
    marginBottom: 20,
  },
  addressText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'monospace',
  },
  balanceSection: {
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  cashbackRate: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  monthlySpentContainer: {
    position: 'absolute',
    top: 24,
    right: 24,
    alignItems: 'flex-end',
  },
  monthlyLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  monthlyAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  insightsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16A34A',
    marginBottom: 20,
    textAlign: 'center',
  },
  insightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  insightItem: {
    alignItems: 'center',
    flex: 1,
  },
  insightAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16A34A',
    marginBottom: 4,
  },
  insightLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  goalProgress: {
    alignItems: 'center',
  },
  goalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 4,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  payLastMerchant: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  payLastText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  recentActivityContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  recentActivityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityIconText: {
    fontSize: 20,
  },
  activityDetails: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#16A34A',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  bottomSpace: {
    height: 100,
  },
});

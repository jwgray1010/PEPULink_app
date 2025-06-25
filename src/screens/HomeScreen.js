import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  const [cardBalance, setCardBalance] = useState(1250.75);
  const [recentTransactions, setRecentTransactions] = useState([
    { id: 1, type: 'payment', amount: -25.50, merchant: 'Coffee Shop', time: '2 min ago' },
    { id: 2, type: 'received', amount: +100.00, merchant: 'Top Up', time: '1 hour ago' },
    { id: 3, type: 'payment', amount: -12.99, merchant: 'Gas Station', time: '3 hours ago' },
  ]);

  const quickActions = [
    { 
      id: 1, 
      title: 'Scan QR', 
      icon: '📱', 
      action: () => navigation.navigate('QR Scanner'),
      color: '#00D2FF' 
    },
    { 
      id: 2, 
      title: 'Send Money', 
      icon: '💸', 
      action: () => {},
      color: '#FF6B6B' 
    },
    { 
      id: 3, 
      title: 'Top Up', 
      icon: '💳', 
      action: () => {},
      color: '#4ECDC4' 
    },
    { 
      id: 4, 
      title: 'AI Assistant', 
      icon: '🤖', 
      action: () => {},
      color: '#45B7D1' 
    },
  ];

  const handleWalletConnect = async () => {
    if (isConnected) {
      disconnect();
    } else {
      const connector = connectors[0];
      if (connector) {
        connect({ connector });
      }
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Wallet Connection */}
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Text style={styles.userInfo}>
              {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
            </Text>
          </View>
          <TouchableOpacity 
            style={[
              styles.walletButton, 
              { backgroundColor: isConnected ? '#4ECDC4' : '#00D2FF' }
            ]}
            onPress={handleWalletConnect}
          >
            <Text style={styles.walletButtonText}>
              {isConnected ? '✅' : '🔗'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Card Balance Section */}
      <View style={styles.cardSection}>
        <LinearGradient
          colors={['#00D2FF', '#45B7D1']}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>LinkLayer Card</Text>
          <Text style={styles.cardBalance}>${cardBalance.toFixed(2)}</Text>
          <Text style={styles.cardSubtitle}>Available Balance</Text>
          
          {/* Chain Balance */}
          {isConnected && balance && (
            <View style={styles.chainBalance}>
              <Text style={styles.chainBalanceText}>
                Chain Balance: {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
              </Text>
            </View>
          )}
        </LinearGradient>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.quickActionItem, { borderColor: action.color }]}
              onPress={action.action}
            >
              <Text style={styles.quickActionIcon}>{action.icon}</Text>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.transactionsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {recentTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <Text style={styles.transactionIconText}>
                {transaction.type === 'payment' ? '💸' : '💰'}
              </Text>
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionMerchant}>{transaction.merchant}</Text>
              <Text style={styles.transactionTime}>{transaction.time}</Text>
            </View>
            <Text style={[
              styles.transactionAmount,
              { color: transaction.amount > 0 ? '#4ECDC4' : '#FF6B6B' }
            ]}>
              {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
            </Text>
          </View>
        ))}
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  walletButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletButtonText: {
    fontSize: 20,
  },
  cardSection: {
    paddingHorizontal: 20,
    marginTop: -30,
  },
  card: {
    borderRadius: 15,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  cardBalance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  chainBalance: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  chainBalanceText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  transactionsSection: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    color: '#00D2FF',
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
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
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionIconText: {
    fontSize: 18,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionMerchant: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  transactionTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

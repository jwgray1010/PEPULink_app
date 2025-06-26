import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Modal,
  TextInput,
  Alert,
  FlatList,
  StatusBar,
  RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi';
import QRCode from 'react-native-qrcode-svg';
import { hapticFeedback, biometricAuth, pushNotifications, performanceUtils } from '../utils/mobile';
import { useTheme } from '../context/ThemeContext';
import { CardSkeleton, TransactionSkeleton, LoadingSpinner } from '../components/Loading';

const { width } = Dimensions.get('window');

// Enhanced Card Component with haptic feedback
const EnhancedCard = ({ cardData, onTopUp, onRequestMoney, theme, isLoading = false }) => {
  if (isLoading) {
    return <CardSkeleton />;
  }

  return (
    <LinearGradient
      colors={theme.colors.gradientCard}
      style={[styles.enhancedCard, { shadowColor: theme.colors.shadowColor }]}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardType, { color: theme.colors.text }]}>PEPULink</Text>
        <Text style={[styles.cardTier, { color: theme.colors.text }]}>{cardData.tier}</Text>
      </View>
      
      <View style={styles.cardBalance}>
        <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>Available Balance</Text>
        <Text style={[styles.balanceAmount, { color: theme.colors.text }]}>${cardData.balance.toFixed(2)}</Text>
      </View>
      
      <View style={styles.cardDetails}>
        <Text style={[styles.cardNumber, { color: theme.colors.text }]}>{cardData.number}</Text>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardName, { color: theme.colors.text }]}>{cardData.name}</Text>
          <Text style={[styles.cardExpiry, { color: theme.colors.text }]}>{cardData.expiry}</Text>
        </View>
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={[styles.cardAction, { backgroundColor: theme.colors.surface }]} 
          onPress={() => {
            hapticFeedback.light();
            onTopUp();
          }}
        >
          <Text style={[styles.cardActionText, { color: theme.colors.text }]}>💳 Top Up</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.cardAction, { backgroundColor: theme.colors.surface }]} 
          onPress={() => {
            hapticFeedback.light();
            onRequestMoney();
          }}
        >
          <Text style={[styles.cardActionText, { color: theme.colors.text }]}>💰 Request</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

// Smart Spending Insights Component
const SmartSpendingInsights = ({ insights, theme }) => (
  <View style={[styles.insightsContainer, { backgroundColor: theme.colors.background }]}>
    <Text style={[styles.insightsTitle, { color: theme.colors.text }]}>🤖 AI Smart Insights</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {insights.map((insight, index) => (
        <View key={index} style={[styles.insightCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadowColor }]}>
          <Text style={[styles.insightCategory, { color: theme.colors.text }]}>{insight.category}</Text>
          <Text style={[styles.insightAmount, { color: theme.colors.primary }]}>${insight.amount}</Text>
          <Text style={[styles.insightTrend, { color: insight.trend.includes('+') ? theme.colors.success : theme.colors.error }]}>{insight.trend}</Text>
          <Text style={[styles.insightTip, { color: theme.colors.textSecondary }]}>{insight.tip}</Text>
        </View>
      ))}
    </ScrollView>
  </View>
);

// Quick Actions Grid with haptic feedback
const QuickActionsGrid = ({ actions, navigation, theme }) => (
  <View style={[styles.quickActionsContainer, { backgroundColor: theme.colors.background }]}>
    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>
    <View style={styles.actionsGrid}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={[
            styles.actionItem, 
            { 
              backgroundColor: action.color + '20',
              borderColor: theme.colors.border,
              shadowColor: theme.colors.shadowColor
            }
          ]}
          onPress={() => {
            hapticFeedback.light();
            if (action.navigation) {
              navigation.navigate(action.navigation);
            } else if (action.action) {
              action.action();
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>{action.icon}</Text>
          <Text style={[styles.actionTitle, { color: theme.colors.text }]}>{action.title}</Text>
          {action.badge && (
            <View style={[styles.actionBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.actionBadgeText}>{action.badge}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// Floating Message Component with theme support
const FloatingMessage = ({ message, onClose, type = 'info', theme }) => {
  if (!message) return null;
  
  const messageColors = {
    info: theme.colors.primary,
    success: theme.colors.success,
    warning: theme.colors.warning,
    error: theme.colors.error,
  };

  return (
    <View style={[styles.floatingMessage, { backgroundColor: messageColors[type] }]}>
      <Text style={styles.floatingMessageText}>{message}</Text>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function HomeScreen({ navigation, onShowAIChat, onShowMerchantQR }) {
  const { theme } = useTheme();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  // Enhanced state management with mobile optimizations
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const [cardData, setCardData] = useState({
    number: "4242 4242 4242 4242",
    name: "LINK MEMBER",
    expiry: "12/28",
    balance: 1250.75,
    tier: "Gold",
    cashbackRate: "5%",
    monthlySpent: 2847.50,
    availableCredit: 15000
  });

  const [showQRModal, setShowQRModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [floatingMessage, setFloatingMessage] = useState(null);
  
  const [aiInsights, setAiInsights] = useState([
    {
      category: 'Dining',
      amount: 450,
      trend: '+23%',
      tip: 'Consider meal prep to save $120/month'
    },
    {
      category: 'Transport',
      amount: 280,
      trend: '-12%',
      tip: 'Great savings this month!'
    },
    {
      category: 'Shopping',
      amount: 320,
      trend: '+8%',
      tip: 'Budget alert: Approaching limit'
    }
  ]);

  const [recentTransactions, setRecentTransactions] = useState([
    { 
      id: 1, 
      type: 'payment', 
      amount: -25.50, 
      merchant: 'Coffee Shop', 
      time: '2 min ago',
      category: 'dining',
      status: 'completed'
    },
    { 
      id: 2, 
      type: 'received', 
      amount: +100.00, 
      merchant: 'Top Up', 
      time: '1 hour ago',
      category: 'transfer',
      status: 'completed'
    },
    { 
      id: 3, 
      type: 'payment', 
      amount: -12.99, 
      merchant: 'Gas Station', 
      time: '3 hours ago',
      category: 'transport',
      status: 'completed'
    },
  ]);

  // Simulated loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Check biometric availability and request permissions
  useEffect(() => {
    checkBiometricAuth();
    requestNotificationPermissions();
  }, []);

  const checkBiometricAuth = async () => {
    const { isAvailable } = await biometricAuth.isAvailable();
    setBiometricEnabled(isAvailable);
  };

  const requestNotificationPermissions = async () => {
    await pushNotifications.requestPermissions();
  };

  // Quick Actions with enhanced mobile features
  const quickActions = [
    { 
      id: 1, 
      title: 'Scan QR', 
      icon: '📱', 
      navigation: 'QR Scanner',
      color: '#00D2FF',
      badge: 'New'
    },
    { 
      id: 2, 
      title: 'Send Money', 
      icon: '💸', 
      action: () => {
        hapticFeedback.medium();
        setShowQRModal(true);
      },
      color: '#FF6B6B'
    },
    { 
      id: 3, 
      title: 'Top Up', 
      icon: '💳', 
      action: () => {
        hapticFeedback.medium();
        setShowTopUpModal(true);
      },
      color: '#4ECDC4'
    },
    { 
      id: 4, 
      title: 'AI Assistant', 
      icon: '🤖', 
      action: () => {
        hapticFeedback.medium();
        onShowAIChat && onShowAIChat();
      },
      color: '#45B7D1'
    },
    { 
      id: 5, 
      title: 'Rewards', 
      icon: '🎁', 
      action: () => {
        hapticFeedback.success();
        Alert.alert('Rewards', 'You have 1,250 points available!');
      },
      color: '#96CEB4'
    },
    { 
      id: 6, 
      title: 'Analytics', 
      icon: '📊', 
      navigation: 'Analytics',
      color: '#FFEAA7'
    },
    { 
      id: 7, 
      title: 'Merchant QR', 
      icon: '🏪', 
      action: () => {
        hapticFeedback.medium();
        onShowMerchantQR && onShowMerchantQR();
      },
      color: '#DDA0DD'
    },
    { 
      id: 8, 
      title: 'Cards', 
      icon: '💳', 
      navigation: 'Cards',
      color: '#98FB98'
    },
  ];

  // Performance optimized handlers
  const handleWalletConnect = async () => {
    try {
      hapticFeedback.light();
      if (isConnected) {
        disconnect();
        setFloatingMessage('Wallet disconnected successfully');
      } else {
        const connector = connectors[0];
        if (connector) {
          await connect({ connector });
          hapticFeedback.success();
          setFloatingMessage('Wallet connected successfully!');
        }
      }
    } catch (error) {
      hapticFeedback.error();
      setFloatingMessage('Failed to connect wallet: ' + error.message);
    }
  };

  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      hapticFeedback.error();
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    // Biometric authentication for large amounts
    if (parseFloat(topUpAmount) > 500 && biometricEnabled) {
      const authResult = await biometricAuth.authenticate('Authenticate to complete top-up');
      if (!authResult.success) {
        hapticFeedback.error();
        Alert.alert('Authentication Failed', authResult.error);
        return;
      }
    }
    
    const amount = parseFloat(topUpAmount);
    setCardData(prev => ({
      ...prev,
      balance: prev.balance + amount
    }));
    
    const newTransaction = {
      id: Date.now(),
      type: 'received',
      amount: amount,
      merchant: 'Top Up',
      time: 'Just now',
      category: 'transfer',
      status: 'completed'
    };
    
    setRecentTransactions(prev => [newTransaction, ...prev]);
    
    // Send notification
    await pushNotifications.scheduleTransactionNotification('received', amount, 'Top Up');
    
    setTopUpAmount('');
    setShowTopUpModal(false);
    hapticFeedback.success();
    setFloatingMessage(`Successfully topped up $${amount.toFixed(2)}!`);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    hapticFeedback.light();
    
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
      setFloatingMessage('Data refreshed successfully!');
    }, 1000);
  };

  const generatePaymentQR = () => {
    const paymentData = {
      type: 'payment',
      address: address || 'demo-address',
      amount: '0',
      timestamp: Date.now(),
      recipient: cardData.name
    };
    return JSON.stringify(paymentData);
  };

  // Auto-dismiss floating message
  useEffect(() => {
    if (floatingMessage) {
      const timer = setTimeout(() => {
        setFloatingMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [floatingMessage]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        barStyle={theme.colors.statusBarStyle} 
        backgroundColor={theme.colors.background} 
      />
      
      <ScrollView 
        style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Card Display */}
        <EnhancedCard 
          cardData={cardData} 
          onTopUp={() => {
            hapticFeedback.light();
            setShowTopUpModal(true);
          }}
          onRequestMoney={() => {
            hapticFeedback.light();
            setShowQRModal(true);
          }}
          theme={theme}
          isLoading={isLoading}
        />

        {/* Wallet Connection Status */}
        <View style={[styles.walletSection, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity 
            style={[
              styles.walletButton, 
              { 
                backgroundColor: isConnected ? theme.colors.success : theme.colors.primary,
                shadowColor: theme.colors.shadowColor 
              }
            ]} 
            onPress={handleWalletConnect}
          >
            {isLoading ? (
              <LoadingSpinner size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.walletButtonText}>
                {isConnected ? '🟢 Connected' : '🔗 Connect Wallet'}
              </Text>
            )}
          </TouchableOpacity>
          
          {isConnected && (
            <Text style={[styles.addressText, { color: theme.colors.textSecondary }]}>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </Text>
          )}
        </View>

        {/* AI Smart Insights */}
        <SmartSpendingInsights insights={aiInsights} theme={theme} />

        {/* Quick Actions Grid */}
        <QuickActionsGrid actions={quickActions} navigation={navigation} theme={theme} />

        {/* Recent Transactions */}
        <View style={[styles.transactionsSection, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Transactions</Text>
          {isLoading ? (
            <View>
              {[...Array(3)].map((_, index) => (
                <TransactionSkeleton key={index} />
              ))}
            </View>
          ) : (
            <FlatList
              data={recentTransactions}
              scrollEnabled={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.transactionItem, { borderBottomColor: theme.colors.border }]}
                  onPress={() => hapticFeedback.selection()}
                >
                  <View style={styles.transactionIcon}>
                    <Text style={styles.transactionEmoji}>
                      {item.type === 'payment' ? '💸' : '💰'}
                    </Text>
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={[styles.transactionMerchant, { color: theme.colors.text }]}>
                      {item.merchant}
                    </Text>
                    <Text style={[styles.transactionTime, { color: theme.colors.textSecondary }]}>
                      {item.time}
                    </Text>
                  </View>
                  <View style={styles.transactionAmount}>
                    <Text style={[
                      styles.transactionAmountText, 
                      { color: item.amount > 0 ? theme.colors.success : theme.colors.error }
                    ]}>
                      {item.amount > 0 ? '+' : ''}${Math.abs(item.amount).toFixed(2)}
                    </Text>
                    <Text style={[styles.transactionStatus, { color: theme.colors.textSecondary }]}>
                      {item.status}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </ScrollView>

      {/* Floating Message */}
      <FloatingMessage 
        message={floatingMessage} 
        onClose={() => setFloatingMessage(null)} 
        theme={theme}
      />

      {/* Enhanced Modals */}
      <Modal
        visible={showQRModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Payment QR Code</Text>
            <TouchableOpacity 
              onPress={() => {
                hapticFeedback.light();
                setShowQRModal(false);
              }}
              style={[styles.closeButton, { backgroundColor: theme.colors.surface }]}
            >
              <Text style={[styles.closeButtonText, { color: theme.colors.text }]}>×</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.qrContainer}>
            <QRCode
              value={generatePaymentQR()}
              size={200}
              backgroundColor={theme.colors.background}
              color={theme.colors.text}
            />
            <Text style={[styles.qrLabel, { color: theme.colors.textSecondary }]}>
              Scan to send payment to {cardData.name}
            </Text>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showTopUpModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTopUpModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Top Up Account</Text>
            <TouchableOpacity 
              onPress={() => {
                hapticFeedback.light();
                setShowTopUpModal(false);
              }}
              style={[styles.closeButton, { backgroundColor: theme.colors.surface }]}
            >
              <Text style={[styles.closeButtonText, { color: theme.colors.text }]}>×</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.topUpContainer}>
            <TextInput
              style={[
                styles.amountInput, 
                { 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text
                }
              ]}
              value={topUpAmount}
              onChangeText={setTopUpAmount}
              placeholder="Enter amount"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
              returnKeyType="done"
            />
            
            <View style={styles.quickAmounts}>
              {[25, 50, 100, 200].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[styles.quickAmountButton, { backgroundColor: theme.colors.surface }]}
                  onPress={() => {
                    hapticFeedback.selection();
                    setTopUpAmount(amount.toString());
                  }}
                >
                  <Text style={[styles.quickAmountText, { color: theme.colors.text }]}>
                    ${amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              style={[styles.topUpButton, { backgroundColor: theme.colors.primary }]} 
              onPress={handleTopUp}
            >
              <Text style={styles.topUpButtonText}>Top Up</Text>
            </TouchableOpacity>
            
            {biometricEnabled && parseFloat(topUpAmount) > 500 && (
              <Text style={[styles.biometricNotice, { color: theme.colors.textSecondary }]}>
                🔒 Biometric authentication required for amounts over $500
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  enhancedCard: {
    margin: 20,
    borderRadius: 16,
    padding: 24,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardTier: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
  },
  cardBalance: {
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardDetails: {
    marginBottom: 20,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 12,
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardExpiry: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  cardActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  walletSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  walletButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  walletButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  addressText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'monospace',
  },
  insightsContainer: {
    marginBottom: 20,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 12,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    marginLeft: 20,
    marginRight: 10,
    padding: 16,
    borderRadius: 12,
    width: 160,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightCategory: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  insightAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  insightTrend: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  insightTip: {
    fontSize: 12,
    lineHeight: 16,
  },
  quickActionsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  actionItem: {
    width: (width - 60) / 4,
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  actionBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  transactionsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  transactionEmoji: {
    fontSize: 20,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionMerchant: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 14,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  transactionStatus: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  floatingMessage: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  floatingMessageText: {
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  qrContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  qrLabel: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  topUpContainer: {
    flex: 1,
    padding: 20,
  },
  amountInput: {
    fontSize: 18,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
    textAlign: 'center',
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickAmountButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.23,
  },
  quickAmountText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  topUpButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  topUpButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  biometricNotice: {
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

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
  RefreshControl,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi';
import QRCode from 'react-native-qrcode-svg';
import { hapticFeedback, biometricAuth, pushNotifications, performanceUtils } from '../utils/mobile';
import { useTheme } from '../context/ThemeContext';
import { CardSkeleton, TransactionSkeleton, LoadingSpinner } from '../components/Loading';
import AdvancedAIFeatures from '../components/AI/AdvancedAIFeatures';

const { width } = Dimensions.get('window');

// Floating Message Component
const FloatingMessage = ({ message, onClose, type = 'info' }) => {
  if (!message) return null;
  
  return (
    <View style={[styles.floatingMessage, styles[`floating${type}`]]}>
      <Text style={styles.floatingText}>{message}</Text>
      <TouchableOpacity onPress={onClose} style={styles.floatingClose}>
        <Text style={styles.floatingCloseText}>×</Text>
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
  const [showAdvancedAI, setShowAdvancedAI] = useState(false);

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

  const onRefresh = async () => {
    setRefreshing(true);
    hapticFeedback.light();
    
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
      setFloatingMessage('Data refreshed successfully!');
    }, 1000);
  };

  const handleWalletConnect = async () => {
    try {
      if (isConnected) {
        disconnect();
        setFloatingMessage('Wallet disconnected successfully');
      } else {
        const connector = connectors[0];
        if (connector) {
          await connect({ connector });
          setFloatingMessage('Wallet connected successfully!');
        }
      }
    } catch (error) {
      setFloatingMessage('Failed to connect wallet: ' + error.message);
    }
  };

  const handleTopUp = () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    // Update card balance
    setCardData(prev => ({
      ...prev,
      balance: prev.balance + parseFloat(topUpAmount)
    }));
    
    setShowTopUpModal(false);
    setTopUpAmount('');
    setFloatingMessage(`Successfully topped up $${topUpAmount}!`);
    hapticFeedback.success();
  };

  const generatePaymentQR = () => {
    return JSON.stringify({
      type: 'payment_request',
      address: address || '0x1234567890123456789012345678901234567890',
      amount: 0,
      timestamp: Date.now()
    });
  };

  // Auto-hide floating message
  useEffect(() => {
    if (floatingMessage) {
      const timer = setTimeout(() => setFloatingMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [floatingMessage]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#22C55E', '#16A34A', '#15803D']}
        style={styles.backgroundGradient}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
              colors={['#fff']}
            />
          }
        >
          {/* PEPULink Card */}
          <View style={styles.cardContainer}>
            <LinearGradient
              colors={['#16A34A', '#15803D']}
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
                  <Text style={styles.roadmapText}>📋 Roadmap</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.addressContainer}>
                <Text style={styles.addressText}>
                  {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : '0x...'}
                </Text>
              </View>
              
              <View style={styles.balanceSection}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <Text style={styles.balanceAmount}>${cardData.balance.toFixed(2)}</Text>
                <Text style={styles.cashbackRate}>{cardData.cashbackRate} cashback rate</Text>
              </View>
              
              <View style={styles.monthlySpentContainer}>
                <Text style={styles.monthlyLabel}>Monthly Spent</Text>
                <Text style={styles.monthlyAmount}>${cardData.monthlySpent}</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Insights Card */}
          <View style={styles.insightsCard}>
            <Text style={styles.insightsTitle}>INSIGHTS - This Month's Data</Text>
            <View style={styles.insightsRow}>
              <View style={styles.insightItem}>
                <Text style={styles.insightAmount}>$142.38</Text>
                <Text style={styles.insightLabel}>Cashback Earned</Text>
              </View>
              <View style={styles.insightItem}>
                <Text style={styles.insightAmount}>$152.5</Text>
                <Text style={styles.insightLabel}>Budget Remaining</Text>
              </View>
            </View>
            <View style={styles.goalProgress}>
              <Text style={styles.goalText}>Goal Progress: 85%</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '85%' }]} />
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.scanButton]}
              onPress={() => navigation.navigate('QR Scanner')}
            >
              <Text style={styles.actionIcon}>📱</Text>
              <Text style={styles.actionText}>Scan QR</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.requestButton]}
              onPress={() => setShowQRModal(true)}
            >
              <Text style={styles.actionIcon}>💳</Text>
              <Text style={styles.actionText}>Request</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.loadButton]}
              onPress={() => setShowTopUpModal(true)}
            >
              <Text style={styles.actionIcon}>💰</Text>
              <Text style={styles.actionText}>Load Card</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.payButton]}
              onPress={() => Alert.alert('Pay Now', 'Quick payment feature')}
            >
              <Text style={styles.actionIcon}>💸</Text>
              <Text style={styles.actionText}>Pay Now</Text>
            </TouchableOpacity>
          </View>

          {/* Pay Last Merchant */}
          <TouchableOpacity style={styles.payLastMerchant}>
            <Text style={styles.payLastText}>💳 Pay Last Merchant</Text>
          </TouchableOpacity>

          {/* Recent Activity */}
          <View style={styles.recentActivityContainer}>
            <Text style={styles.recentActivityTitle}>💳 Recent Activity</Text>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityIconText}>🍔</Text>
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.merchantName}>BURGER PALACE</Text>
                <Text style={styles.activityTime}>Just now  +$0.43 cashback</Text>
              </View>
              <Text style={styles.activityAmount}>-$8.50</Text>
            </View>
          </View>
        </ScrollView>

        {/* Floating AI Button */}
        <TouchableOpacity 
          style={styles.floatingAI}
          onPress={() => setShowAdvancedAI(true)}
        >
          <Text style={styles.floatingAIText}>🤖</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Floating Message */}
      <FloatingMessage 
        message={floatingMessage}
        onClose={() => setFloatingMessage(null)}
      />

      {/* QR Code Modal */}
      <Modal
        visible={showQRModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Payment QR Code</Text>
            <View style={styles.qrContainer}>
              <QRCode
                value={generatePaymentQR()}
                size={200}
                backgroundColor="white"
                color="black"
              />
            </View>
            <Text style={styles.qrInstructions}>
              Share this QR code to receive payments
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalCloseButton]}
              onPress={() => setShowQRModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Top Up Modal */}
      <Modal
        visible={showTopUpModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTopUpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Top Up Card</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter amount"
              value={topUpAmount}
              onChangeText={setTopUpAmount}
              keyboardType="numeric"
            />
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCloseButton]}
                onPress={() => setShowTopUpModal(false)}
              >
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={handleTopUp}
              >
                <Text style={styles.modalConfirmText}>Top Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Advanced AI Features Modal */}
      <AdvancedAIFeatures
        visible={showAdvancedAI}
        onClose={() => setShowAdvancedAI(false)}
      />
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
  cardContainer: {
    marginBottom: 20,
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
  scanButton: {
    backgroundColor: '#16A34A',
  },
  requestButton: {
    backgroundColor: '#6B7280',
  },
  loadButton: {
    backgroundColor: '#6B7280',
  },
  payButton: {
    backgroundColor: '#F59E0B',
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
  floatingAI: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingAIText: {
    fontSize: 24,
  },
  floatingMessage: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1000,
  },
  floatingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  floatingClose: {
    padding: 4,
  },
  floatingCloseText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrInstructions: {
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  modalCloseButton: {
    backgroundColor: '#E5E7EB',
  },
  modalConfirmButton: {
    backgroundColor: '#16A34A',
  },
  modalCloseText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  modalConfirmText: {
    color: '#fff',
    fontWeight: '600',
  },
});

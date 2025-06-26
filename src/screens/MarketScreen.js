import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  Modal,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import components
import MerchantRegistrationForm from '../components/Merchant/MerchantRegistrationForm';
import MerchantQRGenerator from '../components/Merchant/MerchantQRGenerator';
import MerchantDashboard from '../components/Merchant/MerchantDashboard';
import AIMerchantAnalytics from '../components/Merchant/AIMerchantAnalytics';
import NFTRewardsManager from '../components/Merchant/NFTRewardsManager';

const { width, height } = Dimensions.get('window');

const MarketScreen = () => {
  const [merchantData, setMerchantData] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [showAIAnalytics, setShowAIAnalytics] = useState(false);
  const [showNFTRewards, setShowNFTRewards] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMerchantData();
  }, []);

  const loadMerchantData = async () => {
    try {
      const data = await AsyncStorage.getItem('merchantData');
      if (data) {
        const parsedData = JSON.parse(data);
        setMerchantData(parsedData);
        setIsRegistered(true);
      }
    } catch (error) {
      console.error('Error loading merchant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMerchantRegistration = async (formData) => {
    try {
      const merchantInfo = {
        ...formData,
        merchantId: `MERCHANT_${Date.now()}`,
        registeredAt: new Date().toISOString(),
        status: 'active',
        qrCodeData: {
          merchantId: `MERCHANT_${Date.now()}`,
          businessName: formData.businessName,
          paymentAddress: formData.paymentAddress || '0x...',
          chainId: 97741, // LinkLayer V2
        }
      };

      await AsyncStorage.setItem('merchantData', JSON.stringify(merchantInfo));
      setMerchantData(merchantInfo);
      setIsRegistered(true);
      setShowRegistration(false);
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        'Registration Successful!',
        'Your merchant account has been created. You can now generate QR codes for payments.',
        [{ text: 'OK', onPress: () => setShowQRGenerator(true) }]
      );
    } catch (error) {
      console.error('Error registering merchant:', error);
      Alert.alert('Registration Failed', 'Please try again.');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout Merchant Account',
      'Are you sure you want to logout? This will remove your merchant data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('merchantData');
              setMerchantData(null);
              setIsRegistered(false);
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            } catch (error) {
              console.error('Error logging out:', error);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.loadingContainer}
        >
          <Text style={styles.loadingText}>Loading Market...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PEPULink Market</Text>
          <Text style={styles.headerSubtitle}>
            {isRegistered ? 'Merchant Dashboard' : 'Join the Payment Network'}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!isRegistered ? (
          <View style={styles.welcomeSection}>
            <View style={styles.welcomeCard}>
              <Text style={styles.welcomeTitle}>Welcome to PEPULink Market</Text>
              <Text style={styles.welcomeDescription}>
                Join thousands of businesses accepting crypto payments with PEPULink. 
                Get started in minutes with our simple registration process.
              </Text>
              
              <View style={styles.benefitsContainer}>
                <View style={styles.benefitItem}>
                  <Text style={styles.benefitIcon}>🚀</Text>
                  <Text style={styles.benefitText}>Instant Setup</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Text style={styles.benefitIcon}>💰</Text>
                  <Text style={styles.benefitText}>Low Fees</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Text style={styles.benefitIcon}>🔒</Text>
                  <Text style={styles.benefitText}>Secure Payments</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Text style={styles.benefitIcon}>📊</Text>
                  <Text style={styles.benefitText}>Analytics</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setShowRegistration(true);
                }}
              >
                <LinearGradient
                  colors={['#4CAF50', '#45a049']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Register Your Business</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.featuresSection}>
              <Text style={styles.sectionTitle}>Platform Features</Text>
              
              <View style={styles.featureCard}>
                <Text style={styles.featureTitle}>🎯 QR Code Payments</Text>
                <Text style={styles.featureDescription}>
                  Generate custom QR codes for instant crypto payments from customers
                </Text>
              </View>

              <View style={styles.featureCard}>
                <Text style={styles.featureTitle}>📈 Real-time Analytics</Text>
                <Text style={styles.featureDescription}>
                  Track sales, revenue trends, and customer insights with detailed dashboards
                </Text>
              </View>

              <View style={styles.featureCard}>
                <Text style={styles.featureTitle}>🔗 Multi-chain Support</Text>
                <Text style={styles.featureDescription}>
                  Accept payments on LinkLayer V2 and Ethereum mainnet
                </Text>
              </View>

              <View style={styles.featureCard}>
                <Text style={styles.featureTitle}>🛡️ Enterprise Security</Text>
                <Text style={styles.featureDescription}>
                  Bank-grade security with real-time fraud detection and monitoring
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <MerchantDashboard
            merchantData={merchantData}
            onGenerateQR={() => setShowQRGenerator(true)}
            onOpenAIAnalytics={() => setShowAIAnalytics(true)}
            onOpenNFTRewards={() => setShowNFTRewards(true)}
            onLogout={handleLogout}
          />
        )}
      </ScrollView>

      {/* Merchant Registration Modal */}
      <MerchantRegistrationForm
        visible={showRegistration}
        onClose={() => setShowRegistration(false)}
        onSubmit={handleMerchantRegistration}
      />

      {/* QR Generator Modal */}
      <Modal
        visible={showQRGenerator}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <MerchantQRGenerator
          merchantData={merchantData}
          onClose={() => setShowQRGenerator(false)}
        />
      </Modal>

      {/* AI Analytics Modal */}
      <Modal
        visible={showAIAnalytics}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AIMerchantAnalytics
          merchantData={merchantData}
          onClose={() => setShowAIAnalytics(false)}
        />
      </Modal>

      {/* NFT Rewards Modal */}
      <Modal
        visible={showNFTRewards}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <NFTRewardsManager
          merchantData={merchantData}
          onClose={() => setShowNFTRewards(false)}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    paddingVertical: 20,
  },
  welcomeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 15,
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  benefitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  benefitItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
  },
  benefitIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495e',
  },
  registerButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  featuresSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
});

export default MarketScreen;

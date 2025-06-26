import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StatusBar, TouchableOpacity, Platform, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// RainbowKit and Wagmi for Web3
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mainnet } from 'wagmi/chains';

// Theme Provider
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { hapticFeedback } from './src/utils/mobile';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import QRScannerScreen from './src/screens/QRScannerScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import RewardsScreen from './src/screens/RewardsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CardScreen from './src/screens/CardScreen';
import MarketScreen from './src/screens/MarketScreen';

// Import advanced components
import SplashScreen from './src/components/SplashScreen';
import OnboardingTour from './src/components/Onboarding/OnboardingTour';
import SmartSpendingAIChat from './src/components/AI/SmartSpendingAIChat';
import AIIntegrationHub from './src/components/AI/AIIntegrationHub';
import ProfessionalAnalyticsDashboard from './src/components/Analytics/ProfessionalAnalyticsDashboard';
import MerchantQRGenerator from './src/components/Merchant/MerchantQRGenerator';
import PerformanceMonitor from './src/components/Performance/PerformanceMonitor';

// Import services
import NotificationManager from './src/services/NotificationManager';
import AnalyticsService from './src/services/Analytics';
import SecurityService from './src/services/Security';

// Import utilities and config
import { getOnboardingCompleted, setOnboardingCompleted } from './src/utils/storage';
import { linkLayerChain, ethereumMainnet } from './src/config';

// Wagmi configuration
const config = getDefaultConfig({
  appName: 'PEPULink',
  chains: [ethereumMainnet, linkLayerChain],
  projectId: process.env.EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID || 'default-project-id',
});

const queryClient = new QueryClient();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack Navigator
function HomeStackNavigator({ onShowAIChat, onShowMerchantQR }) {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        options={{ headerShown: false }}
      >
        {(props) => (
          <HomeScreen 
            {...props} 
            onShowAIChat={onShowAIChat}
            onShowMerchantQR={onShowMerchantQR}
          />
        )}
      </Stack.Screen>
      <Stack.Screen 
        name="QRScanner" 
        component={QRScannerScreen}
        options={{ 
          title: 'Scan QR Code',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="History" 
        component={HistoryScreen}
        options={{ 
          title: 'Transaction History',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

// Enhanced Tab Navigator with theme support
function ThemedTabNavigator({ setShowAIChat, setShowMerchantQR }) {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = '🏠';
              break;
            case 'History':
              iconName = '📋';
              break;
            case 'QR Scanner':
              iconName = '📱';
              break;
            case 'Analytics':
              iconName = '📊';
              break;
            case 'Rewards':
              iconName = '🎁';
              break;
            case 'Profile':
              iconName = '👤';
              break;
            case 'Analytics':
              iconName = '📊';
              break;
            case 'Cards':
              iconName = '💳';
              break;
            case 'Market':
              iconName = '🏪';
              break;
            default:
              iconName = '🔸';
          }
          
          return (
            <Text style={{ 
              fontSize: focused ? 24 : 20, 
              opacity: focused ? 1 : 0.6 
            }}>
              {iconName}
            </Text>
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        options={{ 
          headerShown: false,
          tabBarLabel: 'Home' 
        }}
      >
        {(props) => (
          <HomeStackNavigator 
            {...props} 
            onShowAIChat={() => setShowAIChat(true)}
            onShowMerchantQR={() => setShowMerchantQR(true)}
          />
        )}
      </Tab.Screen>
      <Tab.Screen 
        name="Cards" 
        component={CardScreen} 
        options={{ 
          headerShown: false,
          tabBarLabel: 'Card' 
        }} 
      />
      <Tab.Screen 
        name="Analytics" 
        component={AnalyticsScreen} 
        options={{ 
          headerShown: false,
          tabBarLabel: 'Analytics' 
        }} 
      />
      <Tab.Screen 
        name="Rewards" 
        component={RewardsScreen} 
        options={{ 
          headerShown: false,
          tabBarLabel: 'Rewards' 
        }} 
      />
      <Tab.Screen 
        name="Market" 
        component={MarketScreen} 
        options={{ 
          headerShown: false,
          tabBarLabel: 'Market' 
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          headerShown: false,
          tabBarLabel: 'Profile' 
        }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showAIHub, setShowAIHub] = useState(false);
  const [showMerchantQR, setShowMerchantQR] = useState(false);
  const [showProfessionalAnalytics, setShowProfessionalAnalytics] = useState(false);
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(__DEV__); // Only in development
  const [appData, setAppData] = useState({
    spendingData: [],
    categoryData: [],
    merchantInfo: null,
  });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize core services
        await NotificationManager.initialize();
        await AnalyticsService.initialize();
        await SecurityService.performSecurityCheck();

        // Track app initialization
        await AnalyticsService.trackEvent('App Initialized', {
          platform: Platform.OS,
          version: '1.0.0',
        });

        // Check if onboarding was completed
        const onboardingCompleted = await getOnboardingCompleted();
        
        if (!onboardingCompleted) {
          setShowOnboarding(true);
        }
        
        // Initialize app data
        setAppData({
          spendingData: [
            { x: 1, y: 120 }, { x: 2, y: 98 }, { x: 3, y: 156 },
            { x: 4, y: 134 }, { x: 5, y: 178 }, { x: 6, y: 142 }, { x: 7, y: 189 }
          ],
          categoryData: [
            { category: 'Food & Dining', amount: 450, percentage: 35, color: '#FF6B6B' },
            { category: 'Transportation', amount: 280, percentage: 22, color: '#4ECDC4' },
            { category: 'Shopping', amount: 320, percentage: 25, color: '#45B7D1' },
            { category: 'Entertainment', amount: 180, percentage: 14, color: '#96CEB4' },
            { category: 'Other', amount: 50, percentage: 4, color: '#FFEAA7' }
          ],
          merchantInfo: {
            name: 'PEPULink Business',
            id: 'LL_MERCHANT_001'
          }
        });

        // Hide splash screen after initialization
        setTimeout(() => setShowSplash(false), 2500);
      } catch (error) {
        console.error('App initialization failed:', error);
        // Track initialization error
        await AnalyticsService.trackError(error, 'app_initialization');
        
        // Still hide splash to prevent infinite loading
        setTimeout(() => setShowSplash(false), 2500);
      }
    };

    initializeApp();

    // Cleanup on unmount
    return () => {
      NotificationManager.cleanup();
      AnalyticsService.trackSessionEnd();
    };
  }, []);

  // Performance monitor toggle (development only)
  useEffect(() => {
    if (__DEV__) {
      const timer = setTimeout(() => {
        // Show performance hint after 10 seconds
        Alert.alert(
          'Developer Mode',
          'Long press on any screen to toggle performance monitor',
          [{ text: 'OK' }]
        );
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleOnboardingComplete = async () => {
    await setOnboardingCompleted(true);
    setShowOnboarding(false);
    
    // Track onboarding completion
    await AnalyticsService.trackOnboarding('completed', true);
    
    // Send welcome notification
    await NotificationManager.sendAIInsight(
      'Welcome to PEPULink! Your AI assistant is ready to help you manage your finances.',
      'welcome'
    );
  };

  const handleOnboardingSkip = async () => {
    await setOnboardingCompleted(true);
    setShowOnboarding(false);
    
    // Track onboarding skip
    await AnalyticsService.trackOnboarding('skipped', false);
  };

  const togglePerformanceMonitor = () => {
    if (__DEV__) {
      setShowPerformanceMonitor(!showPerformanceMonitor);
      hapticFeedback('medium');
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={darkTheme()}>
            <NavigationContainer>
              <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main">
                  {(props) => (
                    <TabNavigatorWithAdvancedFeatures 
                      {...props}
                      onShowAIChat={() => setShowAIChat(true)}
                      onShowAIHub={() => setShowAIHub(true)}
                      onShowMerchantQR={() => setShowMerchantQR(true)}
                      onShowProfessionalAnalytics={() => setShowProfessionalAnalytics(true)}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen name="Cards" component={CardScreen} />
              </Stack.Navigator>
              
              {/* Advanced Feature Modals */}
              <OnboardingTour
                visible={showOnboarding}
                onComplete={handleOnboardingComplete}
                onSkip={handleOnboardingSkip}
              />
              
              <SmartSpendingAIChat
                visible={showAIChat}
                onClose={() => setShowAIChat(false)}
                spendingData={appData.spendingData}
              />
              
              <AIIntegrationHub
                visible={showAIHub}
                onClose={() => setShowAIHub(false)}
                spendingData={appData.spendingData}
              />
              
              <MerchantQRGenerator
                visible={showMerchantQR}
                onClose={() => setShowMerchantQR(false)}
                merchantInfo={appData.merchantInfo}
              />
              
              {showProfessionalAnalytics && (
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                  <ProfessionalAnalyticsDashboard
                    spendingData={appData.spendingData}
                    categoryData={appData.categoryData}
                    onAIInsights={() => {
                      setShowProfessionalAnalytics(false);
                      setShowAIChat(true);
                    }}
                  />
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      top: 60,
                      left: 20,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      borderRadius: 20,
                      padding: 10,
                    }}
                    onPress={() => setShowProfessionalAnalytics(false)}
                  >
                    <Text style={{ color: '#fff', fontSize: 16 }}>← Back</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Performance Monitor (Development Only) */}
              <PerformanceMonitor
                isVisible={showPerformanceMonitor}
                onToggle={togglePerformanceMonitor}
              />
            </NavigationContainer>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </SafeAreaProvider>
  );
}

function TabNavigatorWithAdvancedFeatures({ onShowAIChat, onShowAIHub, onShowMerchantQR, onShowProfessionalAnalytics }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#333',
          paddingTop: 5,
          paddingBottom: 5,
          height: 65,
        },
        tabBarActiveTintColor: '#4ECDC4',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>,
        }}
      >
        {(props) => (
          <HomeStackNavigator 
            {...props} 
            onShowAIChat={onShowAIChat}
            onShowMerchantQR={onShowMerchantQR}
          />
        )}
      </Tab.Screen>
      <Tab.Screen 
        name="Cards" 
        component={CardScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>�</Text>,
          tabBarLabel: 'Card',
        }}
      />
      <Tab.Screen 
        name="Analytics" 
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>�</Text>,
        }}
      >
        {(props) => (
          <AnalyticsScreen 
            {...props} 
            onShowProfessionalAnalytics={onShowProfessionalAnalytics}
          />
        )}
      </Tab.Screen>
      <Tab.Screen 
        name="Rewards" 
        component={RewardsScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🎁</Text>,
        }}
      />
      <Tab.Screen 
        name="Market" 
        component={MarketScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏪</Text>,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

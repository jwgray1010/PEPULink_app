import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StatusBar, TouchableOpacity, Platform } from 'react-native';
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
import HomeScreen from './src/screens/HomeScreen_Enhanced';
import HistoryScreen from './src/screens/HistoryScreen';
import QRScannerScreen from './src/screens/QRScannerScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CardScreen from './src/screens/CardScreen';

// Import advanced components
import SplashScreen from './src/components/SplashScreen';
import OnboardingTour from './src/components/Onboarding/OnboardingTour';
import SmartSpendingAIChat from './src/components/AI/SmartSpendingAIChat';
import ProfessionalAnalyticsDashboard from './src/components/Analytics/ProfessionalAnalyticsDashboard';
import MerchantQRGenerator from './src/components/Merchant/MerchantQRGenerator';

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

// Enhanced Tab Navigator with theme support
function ThemedTabNavigator({ 
  onShowAIChat, 
  onShowMerchantQR, 
  onShowProfessionalAnalytics 
}) {
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
            case 'Profile':
              iconName = '👤';
              break;
            case 'Cards':
              iconName = '💳';
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
          <HomeScreen 
            {...props} 
            onShowAIChat={onShowAIChat}
            onShowMerchantQR={onShowMerchantQR}
          />
        )}
      </Tab.Screen>
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{ 
          headerShown: false,
          tabBarLabel: 'History' 
        }} 
      />
      <Tab.Screen 
        name="QR Scanner" 
        component={QRScannerScreen} 
        options={{ 
          headerShown: false,
          tabBarLabel: 'Scan' 
        }} 
      />
      <Tab.Screen 
        name="Analytics" 
        options={{ 
          headerShown: false,
          tabBarLabel: 'Analytics' 
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
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          headerShown: false,
          tabBarLabel: 'Profile' 
        }} 
      />
      <Tab.Screen 
        name="Cards" 
        component={CardScreen} 
        options={{ 
          headerShown: false,
          tabBarLabel: 'Cards' 
        }} 
      />
    </Tab.Navigator>
  );
}

// Main App Content Component
function AppContent() {
  const { theme } = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showMerchantQR, setShowMerchantQR] = useState(false);
  const [showProfessionalAnalytics, setShowProfessionalAnalytics] = useState(false);

  // Check if onboarding has been completed
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const completed = await getOnboardingCompleted();
        if (!completed) {
          setTimeout(() => {
            setShowOnboarding(true);
          }, 2000);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };

    if (!showSplash) {
      checkOnboarding();
    }
  }, [showSplash]);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider theme={theme.isDark ? darkTheme() : undefined}>
          <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <StatusBar 
              barStyle={theme.colors.statusBarStyle} 
              backgroundColor={theme.colors.background} 
            />
            
            {showSplash ? (
              <SplashScreen onFinish={() => setShowSplash(false)} />
            ) : (
              <>
                <NavigationContainer theme={{
                  dark: theme.isDark,
                  colors: {
                    primary: theme.colors.primary,
                    background: theme.colors.background,
                    card: theme.colors.card,
                    text: theme.colors.text,
                    border: theme.colors.border,
                    notification: theme.colors.primary,
                  },
                }}>
                  <ThemedTabNavigator 
                    onShowAIChat={() => {
                      hapticFeedback.medium();
                      setShowAIChat(true);
                    }}
                    onShowMerchantQR={() => {
                      hapticFeedback.medium();
                      setShowMerchantQR(true);
                    }}
                    onShowProfessionalAnalytics={() => {
                      hapticFeedback.medium();
                      setShowProfessionalAnalytics(true);
                    }}
                  />
                </NavigationContainer>

                {/* Enhanced Modal Components */}
                {showAIChat && (
                  <SmartSpendingAIChat 
                    visible={showAIChat}
                    onClose={() => {
                      hapticFeedback.light();
                      setShowAIChat(false);
                    }}
                  />
                )}

                {showMerchantQR && (
                  <MerchantQRGenerator 
                    visible={showMerchantQR}
                    onClose={() => {
                      hapticFeedback.light();
                      setShowMerchantQR(false);
                    }}
                  />
                )}

                {showProfessionalAnalytics && (
                  <ProfessionalAnalyticsDashboard 
                    visible={showProfessionalAnalytics}
                    onClose={() => {
                      hapticFeedback.light();
                      setShowProfessionalAnalytics(false);
                    }}
                  />
                )}

                {showOnboarding && (
                  <OnboardingTour 
                    visible={showOnboarding}
                    onComplete={() => {
                      hapticFeedback.success();
                      setShowOnboarding(false);
                      setOnboardingCompleted(true);
                    }}
                  />
                )}
              </>
            )}
          </View>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

// Root App Component with Theme Provider
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

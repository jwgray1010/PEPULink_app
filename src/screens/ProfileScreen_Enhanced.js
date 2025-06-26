import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAccount, useDisconnect } from 'wagmi';
import { useTheme } from '../context/ThemeContext';
import { hapticFeedback, biometricAuth } from '../utils/mobile';

export default function ProfileScreen() {
  const { theme, isDark, toggleTheme, themePreference, setSystemTheme, setLightTheme, setDarkTheme } = useTheme();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [autoTopUpEnabled, setAutoTopUpEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  // Check biometric availability on mount
  React.useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const { isAvailable } = await biometricAuth.isAvailable();
    setBiometricAvailable(isAvailable);
  };

  const handleBiometricToggle = async (value) => {
    if (value && biometricAvailable) {
      const result = await biometricAuth.authenticate('Enable biometric authentication for PEPULink');
      if (result.success) {
        setBiometricEnabled(true);
        hapticFeedback.success();
      } else {
        hapticFeedback.error();
        Alert.alert('Authentication Failed', result.error);
      }
    } else {
      setBiometricEnabled(value);
      hapticFeedback.light();
    }
  };

  const profileData = {
    name: 'PEPULink User',
    email: 'user@pepulink.com',
    memberSince: 'June 2025',
    tier: 'Gold Member',
    totalTransactions: 156,
    totalSpent: '$12,450.75',
  };

  const showThemeSelector = () => {
    hapticFeedback.light();
    Alert.alert(
      'Choose Theme',
      'Select your preferred theme',
      [
        { 
          text: 'System', 
          onPress: () => {
            setSystemTheme();
            hapticFeedback.success();
          },
          style: themePreference === 'system' ? 'default' : undefined
        },
        { 
          text: 'Light', 
          onPress: () => {
            setLightTheme();
            hapticFeedback.success();
          },
          style: themePreference === 'light' ? 'default' : undefined
        },
        { 
          text: 'Dark', 
          onPress: () => {
            setDarkTheme();
            hapticFeedback.success();
          },
          style: themePreference === 'dark' ? 'default' : undefined
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const menuItems = [
    {
      title: 'Account Settings',
      icon: '⚙️',
      onPress: () => {
        hapticFeedback.light();
        Alert.alert('Account Settings', 'Coming soon!');
      },
    },
    {
      title: 'Payment Methods',
      icon: '💳',
      onPress: () => {
        hapticFeedback.light();
        Alert.alert('Payment Methods', 'Coming soon!');
      },
    },
    {
      title: 'Security',
      icon: '🔒',
      onPress: () => {
        hapticFeedback.light();
        Alert.alert('Security', 'Coming soon!');
      },
    },
    {
      title: 'Theme Settings',
      icon: '🎨',
      subtitle: `Current: ${themePreference.charAt(0).toUpperCase() + themePreference.slice(1)}`,
      onPress: showThemeSelector,
    },
    {
      title: 'Help & Support',
      icon: '❓',
      onPress: () => {
        hapticFeedback.light();
        Alert.alert('Help & Support', 'Coming soon!');
      },
    },
    {
      title: 'About PEPULink',
      icon: 'ℹ️',
      onPress: () => {
        hapticFeedback.light();
        Alert.alert('About', 'PEPULink v1.0.0\nAdvanced Web3 Payment Platform with Mobile Enhancements');
      },
    },
  ];

  const handleDisconnectWallet = () => {
    hapticFeedback.warning();
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Disconnect', 
          style: 'destructive',
          onPress: () => {
            disconnect();
            hapticFeedback.success();
          }
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        barStyle={theme.colors.statusBarStyle} 
        backgroundColor={theme.colors.background} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={theme.colors.gradientPrimary}
          style={styles.header}
        >
          <Text style={[styles.title, { color: '#FFFFFF' }]}>Profile</Text>
        </LinearGradient>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadowColor }]}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={theme.colors.gradientSecondary}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </LinearGradient>
          </View>
          
          <Text style={[styles.userName, { color: theme.colors.text }]}>{profileData.name}</Text>
          <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>{profileData.email}</Text>
          <Text style={[styles.memberInfo, { color: theme.colors.textSecondary }]}>
            {profileData.tier} • Member since {profileData.memberSince}
          </Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>{profileData.totalTransactions}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Transactions</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>{profileData.totalSpent}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Total Spent</Text>
            </View>
          </View>
        </View>

        {/* Wallet Connection Status */}
        {isConnected && (
          <View style={[styles.walletCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadowColor }]}>
            <View style={styles.walletHeader}>
              <Text style={[styles.walletTitle, { color: theme.colors.text }]}>Connected Wallet</Text>
              <Text style={[styles.connectedIndicator, { color: theme.colors.success }]}>🟢 Connected</Text>
            </View>
            <Text style={[styles.walletAddress, { color: theme.colors.textSecondary }]}>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </Text>
            <TouchableOpacity 
              style={[styles.disconnectButton, { borderColor: theme.colors.error }]} 
              onPress={handleDisconnectWallet}
            >
              <Text style={[styles.disconnectButtonText, { color: theme.colors.error }]}>Disconnect Wallet</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Enhanced Settings Section */}
        <View style={[styles.settingsSection, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadowColor }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Settings</Text>
          
          {/* Notifications Toggle */}
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔔</Text>
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Push Notifications</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Get notified about transactions
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={(value) => {
                setNotificationsEnabled(value);
                hapticFeedback.selection();
              }}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '40' }}
              thumbColor={notificationsEnabled ? theme.colors.primary : theme.colors.textSecondary}
            />
          </View>

          {/* Biometric Authentication Toggle */}
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔐</Text>
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Biometric Authentication</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  {biometricAvailable ? 'Use biometric for secure access' : 'Not available on this device'}
                </Text>
              </View>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={handleBiometricToggle}
              disabled={!biometricAvailable}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '40' }}
              thumbColor={biometricEnabled ? theme.colors.primary : theme.colors.textSecondary}
            />
          </View>

          {/* Auto Top-up Toggle */}
          <View style={[styles.settingItem, { borderBottomColor: 'transparent' }]}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>⚡</Text>
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Auto Top-up</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Automatically top-up when balance is low
                </Text>
              </View>
            </View>
            <Switch
              value={autoTopUpEnabled}
              onValueChange={(value) => {
                setAutoTopUpEnabled(value);
                hapticFeedback.selection();
              }}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '40' }}
              thumbColor={autoTopUpEnabled ? theme.colors.primary : theme.colors.textSecondary}
            />
          </View>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuSection, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadowColor }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>More Options</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem, 
                { borderBottomColor: theme.colors.border },
                index === menuItems.length - 1 && { borderBottomWidth: 0 }
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <View>
                  <Text style={[styles.menuTitle, { color: theme.colors.text }]}>{item.title}</Text>
                  {item.subtitle && (
                    <Text style={[styles.menuSubtitle, { color: theme.colors.textSecondary }]}>
                      {item.subtitle}
                    </Text>
                  )}
                </View>
              </View>
              <Text style={[styles.menuArrow, { color: theme.colors.textSecondary }]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Theme Quick Toggle */}
        <View style={[styles.quickActions, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadowColor }]}>
          <TouchableOpacity
            style={[styles.themeToggle, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              toggleTheme();
              hapticFeedback.medium();
            }}
          >
            <Text style={styles.themeToggleIcon}>{isDark ? '☀️' : '🌙'}</Text>
            <Text style={styles.themeToggleText}>
              Switch to {isDark ? 'Light' : 'Dark'} Mode
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
            PEPULink v1.0.0 • Mobile Enhanced
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 40,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileCard: {
    margin: 20,
    marginTop: -20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 8,
  },
  memberInfo: {
    fontSize: 14,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    marginHorizontal: 20,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  walletCard: {
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  walletTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  connectedIndicator: {
    fontSize: 14,
    fontWeight: '600',
  },
  walletAddress: {
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 16,
  },
  disconnectButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  disconnectButtonText: {
    fontWeight: '600',
  },
  settingsSection: {
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
  },
  menuSection: {
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 24,
    fontWeight: '300',
  },
  quickActions: {
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  themeToggleIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  themeToggleText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 12,
  },
});

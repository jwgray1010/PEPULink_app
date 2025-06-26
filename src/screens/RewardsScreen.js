import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const RewardCard = ({ reward, onPress }) => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.rewardCard, { opacity: fadeAnim }]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <LinearGradient
          colors={reward.gradient || ['#2C3E50', '#34495E']}
          style={styles.rewardGradient}
        >
          <View style={styles.rewardHeader}>
            <Text style={styles.rewardIcon}>{reward.icon}</Text>
            {reward.isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            )}
          </View>
          
          <View style={styles.rewardContent}>
            <Text style={styles.rewardAmount}>{reward.amount}</Text>
            <Text style={styles.rewardTitle}>{reward.title}</Text>
            <Text style={styles.rewardDescription}>{reward.description}</Text>
            
            {reward.progress && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${reward.progress.percentage}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {reward.progress.current}/{reward.progress.total} {reward.progress.unit}
                </Text>
              </View>
            )}
            
            {reward.action && (
              <TouchableOpacity style={styles.actionButton} onPress={reward.action}>
                <Text style={styles.actionButtonText}>{reward.actionText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const StatCard = ({ title, value, subtitle, icon, color }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <View style={styles.statHeader}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statSubtitle}>{subtitle}</Text>
  </View>
);

export default function RewardsScreen() {
  const [totalPEPU, setTotalPEPU] = useState(142.5);
  const [totalUSDValue, setTotalUSDValue] = useState(852.75);

  const rewardsData = [
    {
      icon: '🎁',
      amount: '12.5 PEPU',
      title: 'Cashback Rewards',
      description: 'Earned 1% cashback on purchases',
      gradient: ['#4ECDC4', '#44A08D'],
      action: () => Alert.alert('Cashback', 'View detailed cashback history'),
      actionText: 'View Details',
      progress: {
        current: 125,
        total: 200,
        percentage: 62.5,
        unit: 'transactions'
      }
    },
    {
      icon: '🏆',
      amount: 'Early Adopter',
      title: 'Pioneer Badge',
      description: 'Awarded for being one of the first 100 users',
      gradient: ['#667eea', '#764ba2'],
      isNew: false,
      action: () => Alert.alert('Badge', 'You unlocked this achievement on March 15th'),
      actionText: 'View Achievement'
    },
    {
      icon: '💎',
      amount: '100 PEPU',
      title: 'Monthly Milestone',
      description: 'Spent over 100 PEPU in a month',
      gradient: ['#f093fb', '#f5576c'],
      action: () => Alert.alert('Milestone', 'Congratulations! You\'ve reached your monthly spending goal.'),
      actionText: 'Claim Reward',
      progress: {
        current: 87,
        total: 100,
        percentage: 87,
        unit: 'PEPU spent'
      }
    },
    {
      icon: '🔥',
      amount: '25 PEPU',
      title: 'Streak Bonus',
      description: 'Used PEPULink for 7 consecutive days',
      gradient: ['#fa709a', '#fee140'],
      isNew: true,
      action: () => Alert.alert('Streak', 'Keep using PEPULink daily to maintain your streak!'),
      actionText: 'Continue Streak',
      progress: {
        current: 7,
        total: 30,
        percentage: 23.3,
        unit: 'days'
      }
    },
    {
      icon: '🌟',
      amount: '50 PEPU',
      title: 'Referral Bonus',
      description: 'Invited 3 friends to join PEPULink',
      gradient: ['#a8edea', '#fed6e3'],
      action: () => Alert.alert('Referral', 'Invite more friends to earn additional rewards!'),
      actionText: 'Invite Friends',
      progress: {
        current: 3,
        total: 5,
        percentage: 60,
        unit: 'friends'
      }
    },
    {
      icon: '📱',
      amount: '15 PEPU',
      title: 'QR Payment Master',
      description: 'Completed 50 QR code payments',
      gradient: ['#89f7fe', '#66a6ff'],
      action: () => Alert.alert('QR Master', 'You\'re becoming a QR payment expert!'),
      actionText: 'View History'
    }
  ];

  const stats = [
    {
      title: 'Total Earned',
      value: `${totalPEPU} PEPU`,
      subtitle: `≈ $${totalUSDValue.toFixed(2)}`,
      icon: '💰',
      color: '#4ECDC4'
    },
    {
      title: 'This Month',
      value: '32.5 PEPU',
      subtitle: 'New rewards',
      icon: '📈',
      color: '#667eea'
    },
    {
      title: 'Achievements',
      value: '12',
      subtitle: 'Unlocked',
      icon: '🏆',
      color: '#fa709a'
    },
    {
      title: 'Next Reward',
      value: '48h',
      subtitle: 'Daily bonus',
      icon: '⏰',
      color: '#a8edea'
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#4ECDC4', '#44A08D']}
        style={styles.header}
      >
        <Text style={styles.headerIcon}>🎁</Text>
        <Text style={styles.title}>PEPU Rewards</Text>
        <Text style={styles.subtitle}>Earn rewards for every transaction and milestone</Text>
        
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total PEPU Balance</Text>
          <Text style={styles.balanceAmount}>{totalPEPU} PEPU</Text>
          <Text style={styles.balanceUSD}>≈ ${totalUSDValue.toFixed(2)} USD</Text>
        </View>
      </LinearGradient>

      {/* Demo Notice */}
      <View style={styles.demoNotice}>
        <Text style={styles.demoText}>
          This is a demo rewards page for developers. No wallet required.
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Rewards Overview</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </View>
      </View>

      {/* Active Challenges */}
      <View style={styles.challengesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Challenges</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.challengeCard}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.challengeGradient}
          >
            <Text style={styles.challengeIcon}>🎯</Text>
            <View style={styles.challengeContent}>
              <Text style={styles.challengeTitle}>Weekly Spender</Text>
              <Text style={styles.challengeDescription}>
                Spend 50 PEPU this week to earn 10 PEPU bonus
              </Text>
              <View style={styles.challengeProgress}>
                <View style={styles.challengeProgressBar}>
                  <View style={[styles.challengeProgressFill, { width: '68%' }]} />
                </View>
                <Text style={styles.challengeProgressText}>34/50 PEPU</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Rewards Grid */}
      <View style={styles.rewardsSection}>
        <Text style={styles.sectionTitle}>Your Rewards</Text>
        <View style={styles.rewardsGrid}>
          {rewardsData.map((reward, index) => (
            <RewardCard
              key={index}
              reward={reward}
              onPress={() => {
                if (reward.action) {
                  reward.action();
                }
              }}
            />
          ))}
        </View>
      </View>

      {/* Loyalty Program */}
      <View style={styles.loyaltySection}>
        <Text style={styles.sectionTitle}>Loyalty Program</Text>
        <View style={styles.loyaltyCard}>
          <LinearGradient
            colors={['#f093fb', '#f5576c']}
            style={styles.loyaltyGradient}
          >
            <View style={styles.loyaltyHeader}>
              <Text style={styles.loyaltyIcon}>👑</Text>
              <View style={styles.loyaltyInfo}>
                <Text style={styles.loyaltyTitle}>Gold Member</Text>
                <Text style={styles.loyaltySubtitle}>Level 3 • 2,450 XP</Text>
              </View>
            </View>
            
            <View style={styles.loyaltyProgress}>
              <Text style={styles.loyaltyProgressLabel}>Progress to Platinum</Text>
              <View style={styles.loyaltyProgressBar}>
                <View style={[styles.loyaltyProgressFill, { width: '73%' }]} />
              </View>
              <Text style={styles.loyaltyProgressText}>2,450 / 3,500 XP</Text>
            </View>
            
            <View style={styles.loyaltyBenefits}>
              <Text style={styles.loyaltyBenefitsTitle}>Current Benefits:</Text>
              <Text style={styles.loyaltyBenefit}>• 2% cashback on all purchases</Text>
              <Text style={styles.loyaltyBenefit}>• Priority customer support</Text>
              <Text style={styles.loyaltyBenefit}>• Exclusive monthly rewards</Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafe',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 25,
  },
  balanceCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 5,
  },
  balanceUSD: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  
  // Demo Notice
  demoNotice: {
    backgroundColor: '#E3F2FD',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  demoText: {
    fontSize: 14,
    color: '#1976D2',
    textAlign: 'center',
  },
  
  // Stats Section
  statsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 55) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  
  // Challenges Section
  challengesSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  challengeCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  challengeGradient: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  challengeIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
  },
  challengeDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  challengeProgress: {
    marginTop: 8,
  },
  challengeProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginBottom: 5,
  },
  challengeProgressFill: {
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  challengeProgressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  
  // Rewards Section
  rewardsSection: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  rewardsGrid: {
    marginBottom: 20,
  },
  rewardCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  rewardGradient: {
    padding: 20,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  rewardIcon: {
    fontSize: 32,
  },
  newBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  rewardContent: {
    flex: 1,
  },
  rewardAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 5,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
  },
  rewardDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 15,
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginBottom: 5,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  
  // Loyalty Section
  loyaltySection: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  loyaltyCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  loyaltyGradient: {
    padding: 25,
  },
  loyaltyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  loyaltyIcon: {
    fontSize: 36,
    marginRight: 15,
  },
  loyaltyInfo: {
    flex: 1,
  },
  loyaltyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  loyaltySubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  loyaltyProgress: {
    marginBottom: 20,
  },
  loyaltyProgressLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  loyaltyProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  loyaltyProgressFill: {
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  loyaltyProgressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  loyaltyBenefits: {
    marginTop: 10,
  },
  loyaltyBenefitsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  loyaltyBenefit: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
});
